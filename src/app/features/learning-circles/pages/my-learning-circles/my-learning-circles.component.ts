import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { LearningCirclesGridComponent } from '../../components/learning-circles-grid/learning-circles-grid.component';
import { LearningCirclesPaginationComponent } from '../../components/learning-circles-pagination/learning-circles-pagination.component';
import { MembershipConfirmationModalComponent } from '../../components/membership-confirmation-modal/membership-confirmation-modal.component';
import { LearningCircleListItem } from '../../models/learning-circle.models';
import { SearchPaginationQuery } from '../../models/pagination.models';
import { CircleActionErrorService } from '../../services/circle-action-error.service';
import { LearningCirclesService } from '../../services/learning-circles.service';

@Component({
  selector: 'app-my-learning-circles',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    ToastComponent,
    LearningCirclesGridComponent,
    LearningCirclesPaginationComponent,
    MembershipConfirmationModalComponent,
  ],
  templateUrl: './my-learning-circles.component.html',
  styleUrl: './my-learning-circles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLearningCirclesComponent implements OnInit {
  private readonly circlesService =
    inject(LearningCirclesService);

  private readonly actionErrorService =
    inject(CircleActionErrorService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isManagementContext =
    this.route.snapshot.data['circleContext'] === 'management';

  readonly pageTitle = this.isManagementContext
    ? 'حلقات العلم التي تديرها'
    : 'حلقاتي';

  readonly resultsTitle = this.isManagementContext
    ? 'حلقات العلم التي أنشأتها'
    : 'حلقات العلم المنضم إليها';

  readonly pageDescription = computed(() =>
    this.isManagementContext
      ? 'إدارة حلقات العلم التي أنشأتها ومتابعة الطلاب والمحتوى داخلها.'
      : 'تابع حلقات التعلم التي انضممت إليها ودورك داخل كل حلقة.',
  );

  readonly searchControl = new FormControl('', {
    nonNullable: true,
  });

  readonly circles = signal<LearningCircleListItem[]>([]);
  readonly searchTerm = signal('');
  readonly pageNumber = signal(1);
  readonly pageSize = 9;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);

  readonly loading = signal(false);
  readonly loadFailed = signal(false);
  readonly searchValidation = signal<string | null>(null);
  readonly actionCircleId = signal<string | null>(null);
  readonly selectedCircle =
    signal<LearningCircleListItem | null>(null);

  private listSubscription: Subscription | null = null;
  private requestId = 0;

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        map((value) => value.trim()),
        debounceTime(350),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => {
        this.searchTerm.set(search);
        this.pageNumber.set(1);

        if (search.length === 1) {
          this.searchValidation.set(
            'اكتب حرفين على الأقل للبحث.',
          );

          this.cancelRequest();
          this.resetResults();
          return;
        }

        this.searchValidation.set(null);
        this.loadCircles();
      });
  }

  ngOnInit(): void {
    this.loadCircles();
  }

  showDetails(circle: LearningCircleListItem): void {
    this.navigateToDetails(circle.circleId);
  }

  manageCircle(circle: LearningCircleListItem): void {
    this.navigateToDetails(circle.circleId);
  }

  openLeaveConfirmation(
    circle: LearningCircleListItem,
  ): void {
    this.selectedCircle.set(circle);
  }

  closeLeaveConfirmation(): void {
    if (this.actionCircleId() === null) {
      this.selectedCircle.set(null);
    }
  }

  confirmLeave(): void {
    const circle = this.selectedCircle();

    if (!circle || this.actionCircleId() !== null) {
      return;
    }

    this.actionCircleId.set(circle.circleId);

    this.circlesService
      .leave(circle.circleId)
      .pipe(
        finalize(() => this.actionCircleId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (left) => {
          if (!left) {
            this.toast.show(
              'تعذر مغادرة الحلقة. حاول مرة أخرى.',
              'error',
            );
            return;
          }

          if (
            this.circles().length === 1 &&
            this.pageNumber() > 1
          ) {
            this.pageNumber.update((page) => page - 1);
          }

          this.selectedCircle.set(null);

          this.toast.show(
            'تمت مغادرة حلقة التعلم بنجاح.',
          );

          this.loadCircles();
        },
        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.actionErrorService.getMessage(error, 'leave'),
            'error',
          );
        },
      });
  }

  clearSearch(): void {
    if (this.searchControl.value) {
      this.searchControl.setValue('');
      return;
    }

    this.searchTerm.set('');
    this.searchValidation.set(null);
    this.pageNumber.set(1);
    this.loadCircles();
  }

  goToPage(page: number): void {
    this.pageNumber.set(page);
    this.loadCircles();
  }

  retry(): void {
    this.loadCircles();
  }

  private loadCircles(): void {
    if (this.searchTerm().length === 1) {
      return;
    }

    const currentRequestId = ++this.requestId;

    this.listSubscription?.unsubscribe();

    this.loading.set(true);
    this.loadFailed.set(false);

    const query: SearchPaginationQuery = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      search: this.searchTerm() || undefined,
    };

    const circlesRequest = this.isManagementContext
      ? this.circlesService.getOwned(query)
      : this.circlesService.getJoined(query);

    this.listSubscription = circlesRequest
      .pipe(
        finalize(() => {
          if (currentRequestId === this.requestId) {
            this.loading.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (result) => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          if (
            result.totalPages > 0 &&
            this.pageNumber() > result.totalPages
          ) {
            this.pageNumber.set(result.totalPages);
            this.loadCircles();
            return;
          }

          this.circles.set(result.items);
          this.totalCount.set(result.totalCount);
          this.totalPages.set(result.totalPages);
        },
        error: () => {
          if (currentRequestId !== this.requestId) {
            return;
          }

          this.resetResults();
          this.loadFailed.set(true);
        },
      });
  }

  private cancelRequest(): void {
    ++this.requestId;
    this.listSubscription?.unsubscribe();
    this.listSubscription = null;
    this.loading.set(false);
  }

  private resetResults(): void {
    this.circles.set([]);
    this.totalCount.set(0);
    this.totalPages.set(0);
  }

  private navigateToDetails(circleId: string): void {
    if (this.isManagementContext) {
      void this.router.navigate([
        '/teacher/circles',
        circleId,
      ]);
      return;
    }

    void this.router.navigate(
      ['..', circleId],
      { relativeTo: this.route },
    );
  }
}

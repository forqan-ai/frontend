import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
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

import { Role } from '../../../../core/models/auth.models';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

import { LearningCirclesGridComponent } from '../../components/learning-circles-grid/learning-circles-grid.component';
import { LearningCirclesPaginationComponent } from '../../components/learning-circles-pagination/learning-circles-pagination.component';
import { MembershipConfirmationModalComponent } from '../../components/membership-confirmation-modal/membership-confirmation-modal.component';

import {
  CircleJoinPolicy,
  LearningCircleListItem,
} from '../../models/learning-circle.models';
import { SearchPaginationQuery } from '../../models/pagination.models';

import { CircleActionErrorService } from '../../services/circle-action-error.service';
import { CircleJoinRequestsService } from '../../services/circle-join-requests.service';
import { LearningCirclesService } from '../../services/learning-circles.service';

@Component({
  selector: 'app-explore-learning-circles',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    ToastComponent,
    ScrollRevealDirective,
    LearningCirclesGridComponent,
    LearningCirclesPaginationComponent,
    MembershipConfirmationModalComponent,
  ],
  templateUrl: './explore-learning-circles.component.html',
  styleUrl: './explore-learning-circles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreLearningCirclesComponent implements OnInit {
  private readonly circlesService = inject(LearningCirclesService);
  private readonly joinRequestsService = inject(CircleJoinRequestsService);
  private readonly actionErrorService = inject(CircleActionErrorService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly canCreateCircle = false;

  readonly canJoinCircles =
    this.authService.hasRole(Role.Student) ||
    this.authService.hasRole(Role.Teacher);

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
  readonly selectedCircle = signal<LearningCircleListItem | null>(null);

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
          this.searchValidation.set('اكتب حرفين على الأقل للبحث.');
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
    void this.router.navigate([circle.circleId], {
      relativeTo: this.route,
    });
  }

  openJoinConfirmation(circle: LearningCircleListItem): void {
    const canOpen =
      this.canJoinCircles &&
      !circle.isMember &&
      circle.joinPolicy === CircleJoinPolicy.Automatic;

    if (!canOpen) {
      return;
    }

    this.selectedCircle.set(circle);
  }

  requestToJoin(circle: LearningCircleListItem): void {
    if (
      !this.canJoinCircles ||
      circle.isMember ||
      this.actionCircleId() !== null
    ) {
      return;
    }

    this.actionCircleId.set(circle.circleId);

    this.joinRequestsService
      .create(circle.circleId)
      .pipe(
        finalize(() => this.actionCircleId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toast.show(
            'تم إرسال طلب الانضمام، وسيظهر لك قرار إدارة الحلقة بعد مراجعته.',
          );

          this.loadCircles();
        },
        error: () => {
          this.toast.show(
            'تعذر إرسال طلب الانضمام. حاول مرة أخرى.',
            'error',
          );
        },
      });
  }

  cancelJoinRequest(circle: LearningCircleListItem): void {
    if (this.actionCircleId() !== null) {
      return;
    }

    this.actionCircleId.set(circle.circleId);

    this.joinRequestsService
      .cancel(circle.circleId)
      .pipe(
        finalize(() => this.actionCircleId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toast.show('تم إلغاء طلب الانضمام.');
          this.loadCircles();
        },
        error: () => {
          this.toast.show(
            'تعذر إلغاء طلب الانضمام.',
            'error',
          );
        },
      });
  }

  closeJoinConfirmation(): void {
    if (this.actionCircleId() === null) {
      this.selectedCircle.set(null);
    }
  }

  confirmJoin(): void {
    const circle = this.selectedCircle();

    if (!circle || this.actionCircleId() !== null) {
      return;
    }

    this.actionCircleId.set(circle.circleId);

    this.circlesService
      .join(circle.circleId)
      .pipe(
        finalize(() => this.actionCircleId.set(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (joined) => {
          if (!joined) {
            this.toast.show(
              'تعذر الانضمام إلى الحلقة. حاول مرة أخرى.',
              'error',
            );
            return;
          }

          this.selectedCircle.set(null);

          this.toast.show(
            'تم الانضمام إلى حلقة التعلم بنجاح.',
          );

          this.loadCircles();
        },
        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.actionErrorService.getMessage(error, 'join'),
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
    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.pageNumber() ||
      this.loading()
    ) {
      return;
    }

    this.pageNumber.set(page);
    this.loadCircles();
  }

  retry(): void {
    this.loadCircles();
  }

  private loadCircles(): void {
    const search = this.searchTerm();

    if (search.length === 1) {
      return;
    }

    const currentRequestId = ++this.requestId;

    this.listSubscription?.unsubscribe();

    this.loading.set(true);
    this.loadFailed.set(false);

    const query: SearchPaginationQuery = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      search: search || undefined,
    };

    this.listSubscription = this.circlesService
      .getAll(query)
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
}
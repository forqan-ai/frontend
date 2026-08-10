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
import { ActivatedRoute, Router } from '@angular/router';
import {
  Subscription,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { LearningCircleFormComponent } from '../../components/learning-circle-form/learning-circle-form.component';
import {
  CreateLearningCircleRequest,
  LearningCircleDetails,
  UpdateLearningCircleRequest,
} from '../../models/learning-circle.models';
import { LearningCircleFormErrorService } from '../../services/learning-circle-form-error.service';
import { LearningCirclesService } from '../../services/learning-circles.service';

@Component({
  selector: 'app-edit-learning-circle',
  imports: [
    ToastComponent,
    LearningCircleFormComponent,
  ],
  templateUrl: './edit-learning-circle.component.html',
  styleUrl: './edit-learning-circle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditLearningCircleComponent implements OnInit {
  private readonly circlesService =
    inject(LearningCirclesService);

  private readonly formErrorService =
    inject(LearningCircleFormErrorService);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly details = signal<LearningCircleDetails | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly accessMessage = signal<string | null>(null);

  readonly initialValue =
    computed<CreateLearningCircleRequest | null>(() => {
      const circle = this.details();

      if (!circle) {
        return null;
      }

      return {
        name: circle.name,
        subject: circle.subject,
        description: circle.description,
        joinPolicy: circle.joinPolicy,
      };
    });

  private circleId = '';
  private loadSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('circleId') ?? ''),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((circleId) => {
        this.circleId = circleId;
        this.loadCircle();
      });
  }

  updateCircle(request: UpdateLearningCircleRequest): void {
    if (
      !this.circleId ||
      this.submitting() ||
      this.accessMessage()
    ) {
      return;
    }

    this.submitting.set(true);

    this.circlesService
      .update(this.circleId, request)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (details) => {
          this.toast.show(
            'تم حفظ تعديلات حلقة التعلم بنجاح.',
          );

          void this.router.navigate([
            '/teacher/circles',
            details.circleId,
          ]);
        },
        error: (error: HttpErrorResponse) => {
          this.toast.show(
            this.formErrorService.getMessage(
              error,
              'update',
            ),
            'error',
          );

          if (
            error.status === 403 ||
            error.status === 409
          ) {
            this.loadCircle();
          }
        },
      });
  }

  retry(): void {
    this.loadCircle();
  }

  cancel(): void {
    void this.router.navigate([
      '/teacher/circles/mine',
    ]);
  }

  private loadCircle(): void {
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = null;

    if (!this.circleId) {
      this.loadError.set(
        'رابط حلقة التعلم غير صالح.',
      );
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);
    this.accessMessage.set(null);
    this.details.set(null);

    this.loadSubscription = this.circlesService
      .getDetails(this.circleId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (details) => {
          if (details.isArchived) {
            this.accessMessage.set(
              'لا يمكن تعديل حلقة تعلم مؤرشفة.',
            );
            return;
          }

          if (!details.permissions.canEditCircle) {
            this.accessMessage.set(
              'لا تملك صلاحية تعديل هذه الحلقة.',
            );
            return;
          }

          this.details.set(details);
        },
        error: (error: HttpErrorResponse) => {
          this.loadError.set(
            this.formErrorService.getMessage(
              error,
              'load',
            ),
          );
        },
      });
  }
}

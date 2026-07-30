import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { LearningCircleFormComponent } from '../../components/learning-circle-form/learning-circle-form.component';
import { CreateLearningCircleRequest } from '../../models/learning-circle.models';
import { LearningCircleFormErrorService } from '../../services/learning-circle-form-error.service';
import { LearningCirclesService } from '../../services/learning-circles.service';

@Component({
  selector: 'app-create-learning-circle',
  imports: [
    ToastComponent,
    LearningCircleFormComponent,
  ],
  templateUrl: './create-learning-circle.component.html',
  styleUrl: './create-learning-circle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLearningCircleComponent {
  private readonly circlesService =
    inject(LearningCirclesService);

  private readonly formErrorService =
    inject(LearningCircleFormErrorService);

  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);

  createCircle(request: CreateLearningCircleRequest): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);

    this.circlesService
      .create(request)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (details) => {
          this.toast.show(
            'تم إنشاء حلقة التعلم بنجاح.',
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
              'create',
            ),
            'error',
          );
        },
      });
  }

  cancel(): void {
    void this.router.navigate([
      '/teacher/circles/mine',
    ]);
  }
}

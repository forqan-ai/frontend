import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { LearningCirclesPaginationComponent } from '../../../learning-circles/components/learning-circles-pagination/learning-circles-pagination.component';
import {
  CONSULTATION_STATUS_OPTIONS,
  ConsultationListItem,
  ConsultationStatus,
  consultationStatusClass,
  consultationStatusLabel,
  formatConsultationDate,
} from '../../models/consultation.models';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'app-student-consultations',
  imports: [ReactiveFormsModule, RouterLink, LearningCirclesPaginationComponent],
  templateUrl: './student-consultations.component.html',
  styleUrl: './student-consultations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentConsultationsComponent implements OnInit {
  private readonly consultationService = inject(ConsultationService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusOptions = CONSULTATION_STATUS_OPTIONS;
  readonly statusControl = new FormControl<ConsultationStatus | ''>('', { nonNullable: true });
  readonly consultations = signal<ConsultationListItem[]>([]);
  readonly pageNumber = signal(1);
  readonly pageSize = 6;
  readonly totalCount = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(false);
  readonly loadFailed = signal(false);
  readonly skeletonItems = [1, 2, 3, 4] as const;

  readonly statusLabel = consultationStatusLabel;
  readonly statusClass = consultationStatusClass;
  readonly formatDate = formatConsultationDate;

  private listSubscription: Subscription | null = null;

  constructor() {
    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pageNumber.set(1);
        this.loadConsultations();
      });
  }

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.listSubscription?.unsubscribe();
    this.loading.set(true);
    this.loadFailed.set(false);

    const status = this.statusControl.value || undefined;
    this.listSubscription = this.consultationService
      .getConsultations({
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize,
        status,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (page) => {
          const totalPages = Math.ceil(page.totalCount / page.pageSize);

          if (totalPages > 0 && this.pageNumber() > totalPages) {
            this.pageNumber.set(totalPages);
            this.loadConsultations();
            return;
          }

          this.consultations.set(page.items);
          this.totalCount.set(page.totalCount);
          this.totalPages.set(totalPages);
        },
        error: () => {
          this.consultations.set([]);
          this.totalCount.set(0);
          this.totalPages.set(0);
          this.loadFailed.set(true);
          this.toast.show('تعذر تحميل الاستشارات. حاول مرة أخرى.', 'error');
        },
      });
  }

  changePage(page: number): void {
    if (page === this.pageNumber() || page < 1 || page > this.totalPages()) {
      return;
    }

    this.pageNumber.set(page);
    this.loadConsultations();
  }
}

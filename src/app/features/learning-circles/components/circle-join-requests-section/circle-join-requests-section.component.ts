import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CircleJoinRequest } from '../../models/circle-join-request.models';
import { CircleJoinRequestStatus } from '../../models/learning-circle.models';
import { CircleJoinRequestsService } from '../../services/circle-join-requests.service';

@Component({
  selector: 'app-circle-join-requests-section',
  imports: [DatePipe],
  templateUrl: './circle-join-requests-section.component.html',
  styleUrl: './circle-join-requests-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleJoinRequestsSectionComponent implements OnInit {
  readonly circleId = input.required<string>();
  readonly changed = output<void>();
  readonly requests = signal<CircleJoinRequest[]>([]);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly reviewingId = signal<string | null>(null);

  private readonly service = inject(CircleJoinRequestsService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getAll(this.circleId(), CircleJoinRequestStatus.Pending, 1, 50)
      .pipe(finalize(() => this.loading.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.requests.set(result.items),
        error: () => this.failed.set(true),
      });
  }

  approve(request: CircleJoinRequest): void { this.review(request, true); }
  reject(request: CircleJoinRequest): void { this.review(request, false); }

  private review(request: CircleJoinRequest, approve: boolean): void {
    if (this.reviewingId()) return;
    this.reviewingId.set(request.requestId);
    const operation = approve
      ? this.service.approve(this.circleId(), request.requestId)
      : this.service.reject(this.circleId(), request.requestId);
    operation.pipe(finalize(() => this.reviewingId.set(null)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.requests.update((items) => items.filter((item) => item.requestId !== request.requestId));
          this.changed.emit();
        },
        error: () => this.failed.set(true),
      });
  }
}

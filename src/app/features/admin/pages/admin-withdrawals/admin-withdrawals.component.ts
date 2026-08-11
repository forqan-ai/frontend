import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminWithdrawalService } from '../../../wallet/services/admin-withdrawal.service';
import {
  AdminWithdrawalListItem,
  payoutMethodLabel,
  WithdrawalStatus,
  WithdrawalStatusLabel,
} from '../../../wallet/wallet.models';
import { StatusBadgeComponent } from '../../../wallet/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-withdrawals',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './admin-withdrawals.component.html',
  styleUrl: './admin-withdrawals.component.css',
})
export class AdminWithdrawalsComponent implements OnInit {
  private service = inject(AdminWithdrawalService);

  readonly statusLabel = WithdrawalStatusLabel;
  readonly WithdrawalStatus = WithdrawalStatus;
  readonly payoutMethodLabel = payoutMethodLabel;

  selectedStatus = signal<WithdrawalStatus | null>(null);
  withdrawals = signal<AdminWithdrawalListItem[]>([]);
  currentPage = signal(1);
  readonly pageSize = 10;
  hasNextPage = signal(false);

  loading = signal(true);
  error = signal('');
  actionError = signal('');
  busyId = signal<string | null>(null);

  rejectTarget = signal<AdminWithdrawalListItem | null>(null);
  rejectionReason = signal('');

  readonly tabs: { label: string; value: WithdrawalStatus | null }[] = [
    { label: 'الكل', value: null },
    { label: WithdrawalStatusLabel[WithdrawalStatus.Pending], value: WithdrawalStatus.Pending },
    { label: WithdrawalStatusLabel[WithdrawalStatus.Approved], value: WithdrawalStatus.Approved },
    { label: WithdrawalStatusLabel[WithdrawalStatus.Transferred], value: WithdrawalStatus.Transferred },
    { label: WithdrawalStatusLabel[WithdrawalStatus.Rejected], value: WithdrawalStatus.Rejected },
  ];

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getWithdrawals(this.selectedStatus(), page, this.pageSize).subscribe({
      next: (res) => {
        this.withdrawals.set(res.items);
        this.currentPage.set(res.pageNumber);
        this.hasNextPage.set(res.hasNextPage);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('تعذر تحميل طلبات السحب.');
        this.loading.set(false);
      },
    });
  }

  selectTab(value: WithdrawalStatus | null): void {
    if (this.selectedStatus() === value) return;
    this.selectedStatus.set(value);
    this.loadPage(1);
  }

  nextPage(): void {
    this.loadPage(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.loadPage(this.currentPage() - 1);
  }

  isBusy(w: AdminWithdrawalListItem): boolean {
    return this.busyId() === w.id;
  }

  approve(w: AdminWithdrawalListItem): void {
    this.busyId.set(w.id);
    this.actionError.set('');
    this.service.approve(w.id).subscribe({
      next: () => {
        this.busyId.set(null);
        this.loadPage(this.currentPage());
      },
      error: (err) => {
        this.busyId.set(null);
        this.actionError.set(err?.error?.message ?? 'تعذر اعتماد الطلب.');
      },
    });
  }

  openReject(w: AdminWithdrawalListItem): void {
    this.actionError.set('');
    this.rejectionReason.set('');
    this.rejectTarget.set(w);
  }

  closeReject(): void {
    if (this.busyId()) return;
    this.rejectTarget.set(null);
    this.rejectionReason.set('');
  }

  onRejectionReasonChange(event: Event): void {
    this.rejectionReason.set((event.target as HTMLTextAreaElement).value);
  }

  reject(): void {
    const target = this.rejectTarget();
    if (!target) return;

    const reason = this.rejectionReason().trim();
    if (!reason) return;

    this.busyId.set(target.id);
    this.actionError.set('');
    this.service.reject(target.id, reason).subscribe({
      next: () => {
        this.busyId.set(null);
        this.rejectTarget.set(null);
        this.rejectionReason.set('');
        this.loadPage(this.currentPage());
      },
      error: (err) => {
        this.busyId.set(null);
        this.actionError.set(err?.error?.message ?? 'تعذر رفض الطلب.');
      },
    });
  }

  completeTransfer(w: AdminWithdrawalListItem): void {
    this.busyId.set(w.id);
    this.actionError.set('');
    this.service.completeTransfer(w.id).subscribe({
      next: () => {
        this.busyId.set(null);
        this.loadPage(this.currentPage());
      },
      error: (err) => {
        this.busyId.set(null);
        this.actionError.set(err?.error?.message ?? 'تعذر تأكيد التحويل.');
      },
    });
  }

  teacherImage(w: AdminWithdrawalListItem): string {
    if (!w.teacherImage || w.teacherImage.toLowerCase() === 'null') {
      return 'images/avatar.webp';
    }
    return w.teacherImage.startsWith('http') ? w.teacherImage : `https://localhost:7054${w.teacherImage}`;
  }
}

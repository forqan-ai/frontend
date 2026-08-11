import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminWithdrawalService } from '../../../wallet/services/admin-withdrawal.service';
import {
  AdminWithdrawalDetails,
  PayoutMethod,
  payoutMethodLabel,
  toPayoutMethod,
  WithdrawalStatus,
  WithdrawalStatusLabel,
} from '../../../wallet/wallet.models';
import { StatusBadgeComponent } from '../../../wallet/components/status-badge/status-badge.component';

@Component({
  selector: 'app-admin-withdrawal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  templateUrl: './admin-withdrawal-details.component.html',
  styleUrl: './admin-withdrawal-details.component.css',
})
export class AdminWithdrawalDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AdminWithdrawalService);

  readonly statusLabel = WithdrawalStatusLabel;
  readonly WithdrawalStatus = WithdrawalStatus;
  readonly payoutMethodLabel = payoutMethodLabel;

  withdrawal = signal<AdminWithdrawalDetails | null>(null);
  loading = signal(true);
  error = signal('');
  actionError = signal('');

  showRejectForm = signal(false);
  rejectionReason = signal('');
  submitting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/withdrawals']);
      return;
    }
    this.loadDetails(id);
  }

  loadDetails(id: string): void {
    this.service.getWithdrawalDetails(id).subscribe({
      next: (res) => {
        this.withdrawal.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('تعذر تحميل تفاصيل طلب السحب.');
        this.loading.set(false);
      },
    });
  }

  isBank(w: AdminWithdrawalDetails): boolean {
    return toPayoutMethod(w.payoutMethod) === PayoutMethod.BankTransfer;
  }

  approve(): void {
    const w = this.withdrawal();
    if (!w) return;

    this.submitting.set(true);
    this.actionError.set('');
    this.service.approve(w.id).subscribe({
      next: () => this.loadDetails(w.id),
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.message ?? 'تعذر اعتماد الطلب.');
      },
    });
  }

  openRejectForm(): void {
    this.showRejectForm.set(true);
  }

  closeRejectForm(): void {
    this.showRejectForm.set(false);
    this.rejectionReason.set('');
  }

  reject(): void {
    const w = this.withdrawal();
    if (!w) return;

    const reason = this.rejectionReason().trim();
    if (!reason) return;

    this.submitting.set(true);
    this.actionError.set('');
    this.service.reject(w.id, reason).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeRejectForm();
        this.loadDetails(w.id);
      },
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.message ?? 'تعذر رفض الطلب.');
      },
    });
  }

  completeTransfer(): void {
    const w = this.withdrawal();
    if (!w) return;

    this.submitting.set(true);
    this.actionError.set('');
    this.service.completeTransfer(w.id).subscribe({
      next: () => this.loadDetails(w.id),
      error: (err) => {
        this.submitting.set(false);
        this.actionError.set(err?.error?.message ?? 'تعذر تأكيد التحويل.');
      },
    });
  }

  formatDate(value?: string | null): string {
    return value ? new Date(value).toLocaleString('en-EG') : '—';
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { Withdrawal, payoutMethodLabel, WithdrawalStatus } from '../../wallet.models';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-withdrawal-history',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './withdrawal-history.component.html',
  styleUrl: './withdrawal-history.component.css',
})
export class WithdrawalHistoryComponent implements OnInit {
  private walletService = inject(WalletService);

  readonly payoutMethodLabel = payoutMethodLabel;

  withdrawals = signal<Withdrawal[]>([]);
  currentPage = signal(1);
  readonly pageSize = 10;
  hasNextPage = signal(false);

  loading = signal(true);
  cancelingId = signal<string | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.walletService.getWithdrawals(page, this.pageSize).subscribe({
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

  nextPage(): void {
    this.loadPage(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.loadPage(this.currentPage() - 1);
  }

  canCancel(w: Withdrawal): boolean {
    return w.status === WithdrawalStatus.Pending;
  }

  cancelWithdrawal(id: string): void {
    this.cancelingId.set(id);
    this.error.set('');
    this.walletService.cancelWithdrawal(id).subscribe({
      next: () => {
        this.cancelingId.set(null);
        this.loadPage(this.currentPage());
      },
      error: () => {
        this.cancelingId.set(null);
        this.error.set('تعذر إلغاء الطلب. حاول مرة أخرى.');
      },
    });
  }

  maskDetails(w: Withdrawal): string {
    return w.payoutDetailsMasked ?? '';
  }
}

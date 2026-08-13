import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import {
  WalletSummary,
  WalletTransaction,
  WalletTransactionDirectionLabel,
  WalletTransactionReasonLabel,
} from '../../wallet.models';

@Component({
  selector: 'app-teacher-wallet',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teacher-wallet.component.html',
  styleUrl: './teacher-wallet.component.css',
})
export class TeacherWalletComponent implements OnInit {
  private walletService = inject(WalletService);

  readonly directionLabel = WalletTransactionDirectionLabel;
  readonly reasonLabel = WalletTransactionReasonLabel;

  summaryCards: { key: keyof WalletSummary; title: string; icon: string }[] = [
    { key: 'availableBalance', title: 'الرصيد المتاح', icon: 'bi bi-wallet2' },
    { key: 'totalEarned', title: 'إجمالي الأرباح', icon: 'bi bi-graph-up-arrow' },
    { key: 'pendingWithdrawals', title: 'قيد الانتظار', icon: 'bi bi-hourglass-split' },
    { key: 'totalWithdrawn', title: 'إجمالي المسحوبات', icon: 'bi bi-cash-stack' },
  ];

  summary = signal<WalletSummary | null>(null);
  transactions = signal<WalletTransaction[]>([]);

  currentPage = signal(1);
  readonly pageSize = 8;
  hasNextPage = signal(false);

  loadingSummary = signal(true);
  loadingTransactions = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadSummary();
    this.loadTransactions();
  }

  loadSummary(): void {
    this.walletService.getSummary().subscribe({
      next: (res) => {
        this.summary.set(res);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.error.set('تعذر تحميل بيانات المحفظة.');
        this.loadingSummary.set(false);
      },
    });
  }

  loadTransactions(): void {
    this.walletService.getTransactions(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.transactions.update((old) => [...old, ...res.items]);
        this.hasNextPage.set(res.hasNextPage);
        this.loadingTransactions.set(false);
      },
      error: () => {
        this.error.set('تعذر تحميل الحركات المالية.');
        this.loadingTransactions.set(false);
      },
    });
  }

  loadMore(): void {
    if (!this.hasNextPage()) return;
    this.currentPage.update((p) => p + 1);
    this.loadTransactions();
  }

  formatAmount(value: number | undefined, direction?: string): string {
    const v = value ?? 0;
    const sign = direction === 'Debit' ? '-' : '+';
    return `${sign} ${v.toLocaleString('en-EG')} جنيه`;
  }
}

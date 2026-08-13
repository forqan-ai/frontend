import { Routes } from '@angular/router';

export const WALLET_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/teacher-wallet/teacher-wallet.component').then((c) => c.TeacherWalletComponent),
    title: 'المحفظة',
  },
  {
    path: 'withdraw',
    loadComponent: () =>
      import('./pages/withdrawal-request/withdrawal-request.component').then((c) => c.WithdrawalRequestComponent),
    title: 'طلب سحب أرباح',
  },
  {
    path: 'withdrawals',
    loadComponent: () =>
      import('./pages/withdrawal-history/withdrawal-history.component').then((c) => c.WithdrawalHistoryComponent),
    title: 'طلبات السحب',
  },
];

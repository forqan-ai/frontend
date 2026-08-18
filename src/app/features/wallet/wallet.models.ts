export enum WithdrawalStatus {
  Pending = 0,
  Approved = 1,
  Transferred = 2,
  Rejected = 3,
}

export function toWithdrawalStatus(value: WithdrawalStatus | string): WithdrawalStatus {
  if (typeof value === 'number') {
    return value;
  }
  const key = value.charAt(0).toUpperCase() + value.slice(1);
  return (WithdrawalStatus as unknown as Record<string, WithdrawalStatus>)[key] ?? WithdrawalStatus.Pending;
}

export enum PayoutMethod {
  BankTransfer = 0,
  MobileWallet = 1,
}

export function toPayoutMethod(value: PayoutMethod | string): PayoutMethod {
  if (typeof value === 'number') {
    return value;
  }
  const key = value.charAt(0).toUpperCase() + value.slice(1);
  return (PayoutMethod as unknown as Record<string, PayoutMethod>)[key] ?? PayoutMethod.BankTransfer;
}

export function payoutMethodLabel(value: PayoutMethod | string): string {
  return PayoutMethodLabel[toPayoutMethod(value)];
}

export const WithdrawalStatusLabel: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.Pending]: 'قيد الانتظار',
  [WithdrawalStatus.Approved]: 'معتمد',
  [WithdrawalStatus.Transferred]: 'محوّل',
  [WithdrawalStatus.Rejected]: 'مرفوض',
};

export const WithdrawalStatusClass: Record<WithdrawalStatus, string> = {
  [WithdrawalStatus.Pending]: 'badge-pending',
  [WithdrawalStatus.Approved]: 'badge-approved',
  [WithdrawalStatus.Transferred]: 'badge-transferred',
  [WithdrawalStatus.Rejected]: 'badge-rejected',
};

export const PayoutMethodLabel: Record<PayoutMethod, string> = {
  [PayoutMethod.BankTransfer]: 'تحويل بنكي',
  [PayoutMethod.MobileWallet]: 'محفظة إلكترونية',
};

export const WalletTransactionDirectionLabel: Record<string, string> = {
  Credit: 'إيداع',
  Debit: 'سحب',
};

export const WalletTransactionReasonLabel: Record<string, string> = {
  CourseEarning: 'أرباح دورة',
  CircleEarning: 'أرباح حلقة علم',
  ConsultationEarning: 'أرباح استشارة',
  Withdrawal: 'سحب أرباح',
  Adjustment: 'تعديل رصيد',
  Refund: 'استرداد',
};

export interface WalletSummary {
  availableBalance: number;
  totalEarned: number;
  pendingWithdrawals: number;
  totalWithdrawn: number;
  currency: string;
}

export interface WalletTransaction {
  transactionId: string;
  direction: 'Credit' | 'Debit';
  reason: string;
  amount: number;
  balanceAfter: number;
  notes?: string | null;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  payoutMethod: string;
  payoutDetailsMasked?: string | null;
  status: WithdrawalStatus;
  requestedAt: string;
  approvedAt?: string | null;
  transferredAt?: string | null;
  rejectionReason?: string | null;
  transferReference?: string | null;
}

export interface AdminWithdrawalListItem extends Withdrawal {
  teacherName: string;
  teacherEmail: string;
  teacherImage?: string | null;
}

export interface AllocatedEarning {
  earningId: string;
  courseTitle?: string | null;
  sourceType?: string | null;
  sourceTitle?: string | null;
  isPoints?: boolean;
  netAmount: number;
  createdAt: string;
}

export interface AdminWithdrawalDetails extends AdminWithdrawalListItem {
  bankName?: string | null;
  accountHolderName?: string | null;
  bankAccountNumber?: string | null;
  bankIBAN?: string | null;
  walletProvider?: string | null;
  walletNumber?: string | null;
  reviewedBy?: string | null;
  transferredBy?: string | null;
  rejectedBy?: string | null;
  allocatedEarnings: AllocatedEarning[];
}

export interface CreateWithdrawalRequest {
  amount: number;
  payoutMethod: PayoutMethod;
  bankName?: string | null;
  accountHolderName?: string | null;
  bankAccountNumber?: string | null;
  bankIBAN?: string | null;
  walletProvider?: string | null;
  walletNumber?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

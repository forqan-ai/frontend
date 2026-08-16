export type ConsultationStatus =
  | 'Requested'
  | 'Proposed'
  | 'Confirmed'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export interface ConsultationListQuery {
  pageNumber: number;
  pageSize: number;
  status?: ConsultationStatus;
}

export interface ConsultationPage<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface ConsultationSlot {
  slotId: string;
  startTime: string;
  isSelected: boolean;
}

export interface ConsultationListItem {
  consultationId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  requestText: string;
  pointsPrice: number | null;
  durationMinutes: number | null;
  status: ConsultationStatus;
  createdAt: string;
  respondedAt: string | null;
  acceptedAt: string | null;
  selectedSlot: ConsultationSlot | null;
  rowVersion: string;
}

export interface ConsultationActionFlags {
  canEditProposal: boolean;
  canAccept: boolean;
  canReject: boolean;
  canCancel: boolean;
  canSetMeetingLink: boolean;
  canComplete: boolean;
}

export interface ConsultationDetails extends ConsultationListItem {
  teacherResponseText: string | null;
  slots: ConsultationSlot[];
  platform: string | null;
  meetingLink: string | null;
  meetingLinkSentAt: string | null;
  completedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  serverNowUtc: string;
  actions: ConsultationActionFlags;
}

export interface AcceptConsultationRequest {
  selectedSlotId: string;
  rowVersion: string;
}

export interface ConsultationProposalRequest {
  teacherResponseText: string;
  pointsPrice: number;
  durationMinutes: number;
  startTimes: string[];
  rowVersion: string;
}

export interface SetMeetingLinkRequest {
  platform: string;
  meetingLink: string;
  rowVersion: string;
}

export interface RejectConsultationRequest {
  reason?: string | null;
}

export interface CancelConsultationRequest {
  reason?: string | null;
}

export type TeacherConsultationAction = 'reject' | 'complete' | 'cancel';

export interface ConsultationApiFailure {
  errorCode?: string;
  errorMessage?: string;
}

export interface ConsultationStatusOption {
  value: ConsultationStatus | '';
  label: string;
}

export const CONSULTATION_STATUS_OPTIONS: readonly ConsultationStatusOption[] = [
  { value: '', label: 'الكل' },
  { value: 'Requested', label: 'في انتظار الرد' },
  { value: 'Proposed', label: 'بانتظار تأكيدك' },
  { value: 'Confirmed', label: 'مؤكدة' },
  { value: 'Completed', label: 'مكتملة' },
  { value: 'Rejected', label: 'مرفوضة' },
  { value: 'Cancelled', label: 'ملغاة' },
];

export const TEACHER_CONSULTATION_STATUS_OPTIONS: readonly ConsultationStatusOption[] = [
  { value: '', label: 'الكل' },
  { value: 'Requested', label: 'طلبات جديدة' },
  { value: 'Proposed', label: 'بانتظار تأكيد الطالب' },
  { value: 'Confirmed', label: 'مؤكدة' },
  { value: 'Completed', label: 'مكتملة' },
  { value: 'Rejected', label: 'مرفوضة' },
  { value: 'Cancelled', label: 'ملغاة' },
];

export function consultationStatusLabel(status: ConsultationStatus): string {
  switch (status) {
    case 'Requested':
      return 'في انتظار رد المعلم';
    case 'Proposed':
      return 'بانتظار تأكيدك';
    case 'Confirmed':
      return 'تم تأكيد الاستشارة';
    case 'Completed':
      return 'مكتملة';
    case 'Rejected':
      return 'مرفوضة';
    case 'Cancelled':
      return 'ملغاة';
  }
}

export function teacherConsultationStatusLabel(status: ConsultationStatus): string {
  if (status === 'Requested') return 'طلب جديد';
  if (status === 'Proposed') return 'بانتظار تأكيد الطالب';
  return consultationStatusLabel(status);
}

export function consultationStatusClass(status: ConsultationStatus): string {
  return `status-${status.toLowerCase()}`;
}

export function formatConsultationDate(value: string | null): string {
  if (!value) {
    return 'غير محدد';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'غير محدد';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

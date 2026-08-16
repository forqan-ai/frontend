export interface AppNotification {
  notificationId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceType: string | null;
  referenceId: string | null;
}

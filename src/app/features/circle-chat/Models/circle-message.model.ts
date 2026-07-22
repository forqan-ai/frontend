export interface CircleMessage {
  id: string;
  circleId: string;
  senderId: string;
  senderName: string;
  senderImageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  isMine: boolean;
  isDeleted: boolean;
}

export interface CircleMessagesPage {
  messages: CircleMessage[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SendMessagePayload {
  content: string;
}

export interface EditMessagePayload {
  content: string;
}

export interface UserTypingEvent {
  circleId: string;
  userName: string;
}

export interface UserOfflineEvent {
  userId: string;
  lastSeen: string;
}

export interface OperationResult<T> {
  succeeded: boolean;
  data: T | null;
  errorMessage?: string;
}

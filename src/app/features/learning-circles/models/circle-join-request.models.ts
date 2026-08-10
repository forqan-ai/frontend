import { CircleJoinRequestStatus } from './learning-circle.models';

export interface CircleJoinRequest {
  requestId: string;
  circleId: string;
  requesterUserId: string;
  requesterName: string;
  requesterEmail: string | null;
  requesterProfileImageUrl: string | null;
  status: CircleJoinRequestStatus;
  message: string | null;
  requestedAt: string;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
}

export interface ReviewCircleJoinRequest {
  reviewNote?: string | null;
}

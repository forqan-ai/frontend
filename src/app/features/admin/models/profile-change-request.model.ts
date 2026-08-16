export interface ProfileChangeRequest {
  id: string;
  userId: string;

  CurrentFullName: string;
  CurrentProfileImageURL: string | null;

  newFullName: string | null;
  newProfileImageURL: string | null;

  status: string;
  rejectionReason: string | null;

  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;

  userFullName: string;
  userEmail: string;
}

export interface ReviewProfileChangeRequest {
  approve: boolean;
  rejectionReason?: string | null;
  reviewedBy?: string;
}

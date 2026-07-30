export interface CirclePostAuthor {
  userId: string;
  fullName: string;
  profileImageUrl: string | null;
}

export interface CirclePost {
  postId: string;
  circleId: string;
  content: string;
  imageUrl: string | null;
  author: CirclePostAuthor;
  createdAt: string;
  updatedAt: string | null;
  isPinned: boolean;
  pinnedAt: string | null;
  pinnedByUserId: string | null;
  pinnedByUserName: string | null;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
}

export interface CreateCirclePostRequest {
  content: string;
  image: File | null;
}

export interface UpdateCirclePostRequest {
  content: string;
}

export interface SetCirclePostPinRequest {
  isPinned: boolean;
}

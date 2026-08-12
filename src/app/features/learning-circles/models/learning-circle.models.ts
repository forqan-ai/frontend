export enum CircleRole {
  Member = 'Member',
  Moderator = 'Moderator',
  Owner = 'Owner',
}

export enum CircleJoinPolicy {
  Automatic = 'Automatic',
  RequiresApproval = 'RequiresApproval',
  InviteOnly = 'InviteOnly',
}

export enum CircleJoinRequestStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface CircleTeacher {
  teacherId: string;
  fullName: string;
  profileImageUrl: string | null;
}

export interface CirclePermissions {
  canViewMembers: boolean;
  canViewPosts: boolean;
  canCreatePost: boolean;
  canPinPosts: boolean;
  canManageMembers: boolean;
  canChangeMemberRoles: boolean;
  canEditCircle: boolean;
  canArchiveCircle: boolean;
  canCreateLiveSession: boolean;
  canJoin: boolean;
  canRequestToJoin: boolean;
  canCancelJoinRequest: boolean;
  canReviewJoinRequests: boolean;
  canLeave: boolean;
}

export interface LearningCircleListItem {
  circleId: string;
  name: string;
  subject: string;
  description: string;
  joinPolicy: CircleJoinPolicy;
  teacher: CircleTeacher;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
  currentUserRole: CircleRole | null;
  currentUserJoinRequestStatus: CircleJoinRequestStatus | null;
  lastActivityAt: string;
}

export interface LearningCircleDetails {
  circleId: string;
  name: string;
  subject: string;
  description: string;
  joinPolicy: CircleJoinPolicy;
  teacher: CircleTeacher;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
  currentUserRole: CircleRole | null;
  currentUserJoinRequestStatus: CircleJoinRequestStatus | null;
  pendingJoinRequestsCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  archivedAt: string | null;
  permissions: CirclePermissions;
}

export interface CreateLearningCircleRequest {
  name: string;
  subject: string;
  description: string;
  joinPolicy: CircleJoinPolicy;
}

export interface UpdateLearningCircleRequest {
  name: string;
  subject: string;
  description: string;
  joinPolicy: CircleJoinPolicy;
}

export enum CircleRole {
  Member = 'Member',
  Moderator = 'Moderator',
  Owner = 'Owner',
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
  canLeave: boolean;
}

export interface LearningCircleListItem {
  circleId: string;
  name: string;
  subject: string;
  description: string;
  isOpenForJoin: boolean;
  teacher: CircleTeacher;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
  currentUserRole: CircleRole | null;
  lastActivityAt: string;
}

export interface LearningCircleDetails {
  circleId: string;
  name: string;
  subject: string;
  description: string;
  isOpenForJoin: boolean;
  teacher: CircleTeacher;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
  currentUserRole: CircleRole | null;
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
  isOpenForJoin: boolean;
}

export interface UpdateLearningCircleRequest {
  name: string;
  subject: string;
  description: string;
  isOpenForJoin: boolean;
}

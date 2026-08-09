import { CircleRole } from './learning-circle.models';

export enum AddCircleMemberStatus {
  Added = 'Added',
  AlreadyMember = 'AlreadyMember',
  NotFound = 'NotFound',
  NotStudent = 'NotStudent',
  Inactive = 'Inactive',
  InvalidEmail = 'InvalidEmail',
  DuplicateInRequest = 'DuplicateInRequest',
  NotLearner = 'NotLearner',
}

export type ManageableCircleRole =
  | CircleRole.Member
  | CircleRole.Moderator;

export interface CircleMember {
  userId: string;
  fullName: string;
  email: string | null;
  profileImageUrl: string | null;
  role: CircleRole;
  joinedAt: string;
  canRemove: boolean;
  canChangeRole: boolean;
}

export interface CircleMemberCandidate {
  userId: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
}

export interface AddCircleMembersRequest {
  emails: string[];
}

export interface CircleMemberAdditionResult {
  email: string;
  status: AddCircleMemberStatus;
  userId: string | null;
  fullName: string | null;
  message: string | null;
}

export interface AddCircleMembersResponse {
  requestedCount: number;
  addedCount: number;
  failedCount: number;
  results: CircleMemberAdditionResult[];
}

export interface UpdateCircleMemberRoleRequest {
  role: ManageableCircleRole;
}

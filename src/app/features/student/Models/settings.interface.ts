import { UserDto } from "../../../core/models/auth.models";

export type IUserSettings = UserDto;

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}



export interface CreateProfileChangeRequestDto {
  newFullName?: string | null;
  newProfileImageURL?: string | null;
}

export interface ProfileChangeRequestDto {
  id: string;
  userId: string;

  oldFullName: string;
  oldProfileImageURL: string | null;

  newFullName: string | null;
  newProfileImageURL: string | null;

  status: string;
  rejectionReason: string | null;

  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

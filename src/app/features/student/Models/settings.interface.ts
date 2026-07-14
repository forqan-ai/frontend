import { UserDto } from "../../../core/models/auth.models";

export type IUserSettings = UserDto;

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
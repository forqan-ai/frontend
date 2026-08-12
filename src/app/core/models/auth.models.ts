export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export interface Payload {
  role: string;
  email: string;
  id: string;
  exp: number;
}

export interface RegisterResponse {
  succeeded: boolean;
  data: RegisterData
  errors: ApiError[] | null;
}

export interface RegisterData {
  userId: string,
  confirmationToken: string
}




export interface AuthResponse {
  succeeded: boolean;
  data: AuthData;
  errors: ApiError[] | null;
}

export interface AuthData {
  token: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  profileImageURL: string | null;
}

export type ExternalProvider = 'google' | 'facebook';

export interface ApiError {
  code: string;
  description: string;
}

export enum Role {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin'
}


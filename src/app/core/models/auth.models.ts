export interface LoginRequest {
  email: string;
  password: string;
  // rememberMe:boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  roles: string[];
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  succeeded: boolean;
  errors: ApiError[];
}

export type ExternalProvider = 'google' | 'facebook';


export interface ApiResponse<T> {
  succeeded: boolean;
  data: T | null;
  errors: ApiError[];
}
export interface ApiError {
  code: string;
  description: string;
}


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
}

export type ExternalProvider = 'google' | 'facebook';

export interface ApiError {
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

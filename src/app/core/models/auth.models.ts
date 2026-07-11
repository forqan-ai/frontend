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
  succeeded: boolean;
  data: AuthData;
  errors: ApiError[];
}
export interface AuthData {
  token: string;
  user: AuthUser;
}

export type ExternalProvider = 'google' | 'facebook';


export interface ApiError {
  code: string;
  description: string;
}

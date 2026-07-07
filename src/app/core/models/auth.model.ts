export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string; // Kept optional depending on third-party registration, but usually required
}
export interface LoginRequest {
  email: string;
  password: string; // Kept optional depending on third-party registration, but usually required
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe:boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

export interface Payload{
  role:string;
  email:string;
  id:string;
  exp:number;
}

export interface AuthResponse {
  succeeded: boolean;
  data: AuthData;
  errors: ApiError[];
}
export interface AuthData {
  confirmationToken: string;
  userId: string;
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

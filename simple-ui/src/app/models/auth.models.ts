export interface AuthResponse {
  valid: boolean;
  email?: string;
  isAdmin?: boolean;
}

export interface UserInfo {
  email: string;
  isAdmin: boolean;
}
// ─────────────────────────────────────────────────────────────────
// AUTH TYPES
// ─────────────────────────────────────────────────────────────────

export interface PermissionInfo {
  id: string;
  name: string;
  slug: string;
}

export interface RoleInfo {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  isActive?: boolean;
  roles?: RoleInfo[];
  permissions?: PermissionInfo[];
  lastLoginAt?: string;
  createdAt?: string;
}

/** Full envelope from GET /admin/profile */
export interface ProfileResponse {
  statusCode: number;
  message: string;
  data: User;
}

// ── Login ─────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// ── Refresh Token ─────────────────────────────────────────────────────

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// ── Logout ────────────────────────────────────────────────────────────

export interface LogoutRequest {
  refreshToken: string;
}

// ── Forgot Password ───────────────────────────────────────────────────

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// ── Verify OTP ────────────────────────────────────────────────────────

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

// ── Resend OTP ────────────────────────────────────────────────────────

export interface ResendOtpRequest {
  email: string;
  type: "FORGOT_PASSWORD" | "VERIFY_EMAIL";
}

export interface ResendOtpResponse {
  message: string;
}

// ── Reset Password ────────────────────────────────────────────────────

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ── Error ─────────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

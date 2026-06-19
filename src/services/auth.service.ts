/**
 * ─────────────────────────────────────────────────────────────────
 * AUTH SERVICE
 *
 * All authentication API calls.
 * ─────────────────────────────────────────────────────────────────
 */

import { api } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from "@/types/auth.types";

export const AuthService = {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>("/admin/auth/login", credentials);
  },

  logout(body: LogoutRequest): Promise<void> {
    return api.post<void>("/admin/auth/logout", body);
  },

  refreshToken(body: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return api.post<RefreshTokenResponse>("/admin/auth/refresh", body);
  },

  getProfile(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  forgotPassword(body: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>("/auth/forgot-password", body);
  },

  verifyEmail(body: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return api.post<VerifyOtpResponse>("/auth/verify-email", body);
  },

  resendOtp(body: ResendOtpRequest): Promise<ResendOtpResponse> {
    return api.post<ResendOtpResponse>("/auth/resend-otp", body);
  },

  resetPassword(body: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return api.post<ResetPasswordResponse>("/auth/reset-password", body);
  },
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type {
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

// ── Login ─────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: async (response) => {
      const { accessToken, refreshToken } = response.data;
      // Fetch user profile after successful login
      try {
        const user = await AuthService.getProfile();
        setAuth(user, accessToken, refreshToken);
      } catch {
        // If profile fetch fails, still set tokens but with minimal user info
        setAuth(
          { id: "", name: "Admin", email: "", role: "admin" },
          accessToken,
          refreshToken,
        );
      }
      router.push("/dashboard");
    },
    // Login errors are displayed inline in the LoginForm — no toast needed
  });
}

// ── Logout ────────────────────────────────────────────────────────────

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  return useMutation({
    mutationFn: () => AuthService.logout({ refreshToken: refreshToken ?? "" }),
    onSettled: () => {
      logout();
      router.push("/login");
    },
  });
}

// ── Forgot Password ───────────────────────────────────────────────────

export function useForgotPassword() {
  const toast = useToast();
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => AuthService.forgotPassword(body),
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Verify OTP ────────────────────────────────────────────────────────

export function useVerifyOtp() {
  const toast = useToast();
  return useMutation({
    mutationFn: (body: VerifyOtpRequest) => AuthService.verifyEmail(body),
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Resend OTP ────────────────────────────────────────────────────────

export function useResendOtp() {
  const toast = useToast();
  return useMutation({
    mutationFn: (body: ResendOtpRequest) => AuthService.resendOtp(body),
    onSuccess: () => {
      toast.success("OTP sent successfully. Please check your email.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Reset Password ────────────────────────────────────────────────────

export function useResetPassword() {
  const toast = useToast();
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => AuthService.resetPassword(body),
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

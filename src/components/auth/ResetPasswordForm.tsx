"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useResetPassword } from "@/hooks/useAuth";
import PasswordStrength from "./PasswordStrength";

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/\d/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  email: string;
}

export default function ResetPasswordForm({ email }: ResetPasswordFormProps) {
  const { mutate: resetPassword, isPending, error, isSuccess } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetFormValues) => {
    resetPassword(
      { email, otp: "", newPassword: data.newPassword },
    );
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
          <FiCheckCircle className="size-7 text-emerald-500" />
        </div>
        <div>
          <p className="text-base font-bold text-slate-800">Password reset successful</p>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
            Your password has been updated. You can now sign in with your new credentials.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          Back to Sign In
          <FiArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
        <p className="text-xs text-indigo-700 leading-relaxed">
          Create a strong new password for{" "}
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          New Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            {...register("newPassword", { onChange: (e) => setPasswordValue(e.target.value) })}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
            {errors.newPassword.message}
          </p>
        )}
        <PasswordStrength password={passwordValue} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Confirm Password
        </label>
        <div className="relative">
          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            tabIndex={-1}
          >
            {showConfirm ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100 mt-0.5">
            <span className="size-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-xs font-medium text-rose-700">
            {error instanceof Error ? error.message : "Failed to reset password"}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Resetting Password...
          </>
        ) : (
          <>
            Reset Password
            <FiArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

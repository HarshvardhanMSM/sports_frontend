"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useLogin } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const apiErrorMessage =
    error instanceof Error
      ? error.message.includes("longer than or equal to") ||
        error.message.includes("characters") ||
        error.message.toLowerCase().includes("password must")
        ? "Invalid email or password"
        : error.message
      : "Invalid email or password";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FiMail className="size-4 text-slate-400" />
          </div>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all duration-200"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium">
            <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FiLock className="size-4 text-slate-400" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-11 py-3.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100/80 transition-all duration-200"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 flex items-center gap-1.5 mt-1 font-medium">
            <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password link */}
      <div className="flex items-center justify-end pt-1">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* API Error */}
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3.5 flex items-start gap-3 transition-all duration-200">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100/80 mt-0.5">
            <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-rose-700 leading-normal">{apiErrorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
      >
        {isPending ? (
          <>
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            Sign In to Dashboard
            <FiArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

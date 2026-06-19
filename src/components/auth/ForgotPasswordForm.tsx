"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useForgotPassword } from "@/hooks/useAuth";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { mutate: sendOtp, isPending, error, isSuccess } = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotFormValues) => {
    setSubmittedEmail(data.email);
    sendOtp(data, {
      onSuccess: () => {
        setTimeout(() => onSuccess(data.email), 800);
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
          <FiCheckCircle className="size-7 text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">OTP sent successfully</p>
          <p className="text-xs text-slate-500 mt-1">
            We sent a code to <span className="font-semibold text-slate-700">{submittedEmail}</span>
          </p>
        </div>
        <button
          onClick={() => onSuccess(submittedEmail)}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          Verify OTP
          <FiArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
        <p className="text-xs text-indigo-700 leading-relaxed">
          Enter your registered email address and we&apos;ll send you a one-time password to reset your account credentials.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email Address
        </label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-500 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
            {errors.email.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100 mt-0.5">
            <span className="size-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-xs font-medium text-rose-700">
            {error instanceof Error ? error.message : "Failed to send OTP"}
          </p>
        </div>
      )}

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
            Sending...
          </>
        ) : (
          <>
            Send Reset Code
            <FiArrowRight className="size-4" />
          </>
        )}
      </button>

      <div className="text-center pt-1">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <FiArrowLeft className="size-3.5" />
          Back to login
        </Link>
      </div>
    </form>
  );
}

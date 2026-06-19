"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FiArrowLeft, FiClock, FiArrowRight } from "react-icons/fi";
import { useVerifyOtp, useResendOtp } from "@/hooks/useAuth";

interface OtpVerificationFormProps {
  email: string;
  onSuccess: (email: string) => void;
  onBack: () => void;
}

const RESEND_COOLDOWN = 60;

export default function OtpVerificationForm({
  email,
  onSuccess,
  onBack,
}: OtpVerificationFormProps) {
  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const next = [...digits];
      next[index] = value.slice(-1);
      setDigits(next);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    const focusIdx = Math.min(text.length, 5);
    inputRefs.current[focusIdx]?.focus();
  }, [digits]);

  const handleVerify = () => {
    const otp = digits.join("");
    if (otp.length !== 6) return;
    verifyOtp(
      { email, otp },
      { onSuccess: () => onSuccess(email) },
    );
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    resendOtp(
      { email, type: "FORGOT_PASSWORD" },
      { onSuccess: () => setCooldown(RESEND_COOLDOWN) },
    );
  };

  const otpComplete = digits.every((d) => d !== "");
  const errorMessage =
    verifyError instanceof Error ? verifyError.message : "Invalid OTP. Please try again.";

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
        <p className="text-xs text-indigo-700 leading-relaxed">
          Enter the 6-digit verification code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Verification Code
        </label>
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`flex-1 min-w-0 aspect-square max-w-[52px] rounded-xl border-2 bg-slate-50 text-center text-lg font-bold text-slate-800 outline-none transition-all ${
                digit
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Error */}
      {verifyError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 flex items-start gap-3">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100 mt-0.5">
            <span className="size-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-xs font-medium text-rose-700">{errorMessage}</p>
        </div>
      )}

      {/* Resend */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2.5">
        <FiClock className="size-3.5 text-slate-400" />
        {cooldown > 0 ? (
          <span>
            Resend available in{" "}
            <span className="font-bold text-slate-700">{cooldown}s</span>
          </span>
        ) : (
          <>
            <span>Did not receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          </>
        )}
      </div>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={!otpComplete || isVerifying}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
      >
        {isVerifying ? (
          <>
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying...
          </>
        ) : (
          <>
            Verify & Continue
            <FiArrowRight className="size-4" />
          </>
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          <FiArrowLeft className="size-3.5" />
          Change email address
        </button>
      </div>
    </div>
  );
}

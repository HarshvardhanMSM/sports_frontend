"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtp, useResendOtp } from "@/hooks/useAuth";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { resolveImageUrl } from "@/lib/image";
import { Anton, Archivo_Narrow } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const archivoNarrow = Archivo_Narrow({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
});

const RESEND_COOLDOWN = 60;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const { data: storeSettings } = useStoreSettings();
  const { mutate: verifyOtp, isPending: isVerifying, error: verifyError } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const hasCustomLogo = !!storeSettings?.logoUrl;
  const logoSrc = hasCustomLogo
    ? resolveImageUrl(storeSettings.logoUrl)
    : "/assets/logos/Final%20file_Logo%20.png";
  const storeName = storeSettings?.storeName || "Jaebees Sports";
  const storeTagline = storeSettings?.storeTagline || "Manage your sports store with seamless control";

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `VERIFY OTP | ${storeName.toUpperCase()}`;
    }
  }, [storeName]);

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
      {
        onSuccess: () => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        },
      },
    );
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    resendOtp(
      { email, type: "FORGOT_PASSWORD" },
      { onSuccess: () => setCooldown(RESEND_COOLDOWN) },
    );
  };

  const onBack = () => {
    router.push("/forgot-password");
  };

  if (!email) {
    if (typeof window !== "undefined") {
      router.push("/forgot-password");
    }
    return null;
  }

  const otpComplete = digits.every((d) => d !== "");
  const errorMessage =
    verifyError instanceof Error ? verifyError.message : "Invalid OTP. Please try again.";

  return (
    <div
      className={`${anton.variable} ${archivoNarrow.variable} fixed inset-0 z-50 bg-[#0a0a0a] text-white overflow-y-auto font-body-lg flex flex-col`}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for elite feel */
        .fixed::-webkit-scrollbar { width: 6px; }
        .fixed::-webkit-scrollbar-track { background: #0a0a0a; }
        .fixed::-webkit-scrollbar-thumb { background: #333333; }
        .fixed::-webkit-scrollbar-thumb:hover { background: #ffffff; }
        
        /* Focus state for inputs */
        .login-input:focus {
          border-bottom-color: #ffffff !important;
          outline: none;
        }

        /* Obsidian Interaction */
        .btn-hover-effect:hover {
          box-shadow: 4px 4px 0px 0px #ffffff;
          transform: translate(-2px, -2px);
        }

        .font-display-lg {
          font-family: var(--font-anton), sans-serif;
          font-size: 40px;
          line-height: 100%;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .font-display-lg {
            font-size: 48px;
          }
        }
        .font-body-lg {
          font-family: var(--font-archivo-narrow), sans-serif;
          font-size: 18px;
          line-height: 160%;
          font-weight: 400;
        }
        .font-label-bold {
          font-family: var(--font-archivo-narrow), sans-serif;
          font-size: 14px;
          line-height: 100%;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .font-headline-md {
          font-family: var(--font-anton), sans-serif;
          font-size: 24px;
          line-height: 120%;
          font-weight: 400;
        }
        .font-display-lg-mobile {
          font-family: var(--font-anton), sans-serif;
          font-size: 48px;
          line-height: 100%;
          font-weight: 400;
        }
        .font-headline-lg {
          font-family: var(--font-anton), sans-serif;
          font-size: 32px;
          line-height: 110%;
          letter-spacing: 0.02em;
          font-weight: 400;
        }
        .font-label-sm {
          font-family: var(--font-archivo-narrow), sans-serif;
          font-size: 12px;
          line-height: 100%;
          font-weight: 500;
        }
        .font-display-xl {
          font-family: var(--font-anton), sans-serif;
          font-size: 96px;
          line-height: 100%;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .font-display-xl {
            font-size: 48px;
          }
        }
        .font-body-md {
          font-family: var(--font-archivo-narrow), sans-serif;
          font-size: 16px;
          line-height: 150%;
          font-weight: 400;
        }
      `}</style>

      {/* Main Content Area: Split-screen */}
      <main className="flex-grow flex flex-col md:flex-row w-full">
        {/* Left Side: Hero Section */}
        <section className="relative w-full md:w-1/2 min-h-[400px] md:min-h-0 overflow-hidden flex items-end p-5 md:p-16">
          <img
            alt="Professional athlete sprinting in monochrome"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
            src="/assets/images/imagelog.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70"></div>
          <div className="relative z-10 w-full">
            <h1 className="font-display-xl text-5xl md:text-8xl text-white leading-none uppercase italic border-l-8 border-white pl-6">
              PUSH YOUR<br />LIMITS
            </h1>
            <p className="mt-6 font-label-bold text-white max-w-sm uppercase tracking-widest">
              {storeTagline}
            </p>
          </div>
          {/* Grid Overlay Design Element */}
          <div className="absolute inset-0 pointer-events-none border-r border-[#444444]"></div>
        </section>

        {/* Right Side: OTP Verification Form */}
        <section className="w-full md:w-1/2 bg-black flex items-center justify-center p-5 md:p-16">
          <div className="w-full max-w-md space-y-16">
            {/* Brand & Header */}
            <div className="space-y-2">
              <div className="font-display-lg text-3xl md:text-4xl text-white">
                {hasCustomLogo ? (
                  <img src={logoSrc} alt={storeName} className="h-10 object-contain" />
                ) : (
                  storeName.toUpperCase()
                )}
              </div>
              <h2 className="font-headline-lg text-white uppercase">Check your email</h2>
              <p className="font-body-md text-[#a0a0a0] uppercase tracking-wider">Enter the 6-digit code sent to your email.</p>
            </div>

            <div className="space-y-6">
              {/* Info banner */}
              <div className="border border-[#333333] bg-[#111111] px-4 py-3 text-xs text-[#a0a0a0] leading-relaxed uppercase tracking-wider">
                Enter the 6-digit verification code sent to <span className="text-white font-bold">{email}</span>
              </div>

              {/* OTP Inputs */}
              <div className="space-y-2">
                <label className="font-label-bold uppercase text-[10px] text-[#a0a0a0]">
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
                      className={`flex-1 min-w-0 aspect-square max-w-[52px] rounded-none border-2 bg-[#1a1a1a] text-center text-lg font-bold text-white outline-none transition-all ${digit
                        ? "border-white bg-[#222222]"
                        : "border-white/20 focus:border-white"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {verifyError && (
                <div className="border border-[#93000a] bg-[#93000a]/20 px-4 py-3 text-xs font-semibold text-[#ffb4ab] uppercase tracking-wider">
                  {errorMessage}
                </div>
              )}

              {/* Resend Cooldown bar */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#a0a0a0] bg-[#111111] border border-[#333333] px-4 py-3 uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {cooldown > 0 ? (
                  <span>
                    Resend available in <span className="text-white font-bold">{cooldown}s</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Did not receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="font-bold text-white hover:underline cursor-pointer disabled:text-[#666666] disabled:no-underline disabled:cursor-not-allowed"
                    >
                      {isResending ? "SENDING..." : "RESEND CODE"}
                    </button>
                  </div>
                )}
              </div>

              {/* Verify button */}
              <button
                type="button"
                onClick={handleVerify}
                disabled={!otpComplete || isVerifying}
                className="w-full bg-white text-black font-display-lg text-2xl py-4 uppercase tracking-widest transition-all duration-75 active:scale-[0.98] btn-hover-effect disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin size-5 text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    VERIFYING...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={onBack}
                className="font-body-md text-[#a0a0a0] uppercase hover:text-white hover:underline cursor-pointer"
              >
                Change email address
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-[#333333] flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-6 w-full mt-auto">
        <div className="font-display-lg text-2xl text-white tracking-tighter mb-6 md:mb-0">
          {storeName.toUpperCase()}
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="font-label-sm uppercase text-[#a0a0a0]">© 2026 {storeName.toUpperCase()}. All rights reserved.</span>
        </div>
      </footer>

      {/* Interactive Layer: Dynamic Scan Lines (Subtle Gray) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[100]" style={{ background: "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 2px)", backgroundSize: "100% 3px" }}></div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}

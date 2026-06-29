"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useAuth";
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

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { data: storeSettings } = useStoreSettings();
  const { mutate: sendOtp, isPending, error, isSuccess } = useForgotPassword();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [activeInput, setActiveInput] = useState<"email" | null>(null);

  const hasCustomLogo = !!storeSettings?.logoUrl;
  const logoSrc = hasCustomLogo
    ? resolveImageUrl(storeSettings.logoUrl)
    : "/assets/logos/Final%20file_Logo%20.png";
  const storeName = storeSettings?.storeName || "Jaebees Sports";
  const storeTagline = storeSettings?.storeTagline || "Manage your sports store with seamless control";

  const placeholderEmail = `ADMIN@${storeName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}.COM`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `FORGOT PASSWORD | ${storeName.toUpperCase()}`;
    }
  }, [storeName]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const handleSuccess = (email: string) => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  const onSubmit = (data: ForgotFormValues) => {
    setSubmittedEmail(data.email);
    sendOtp(data, {
      onSuccess: () => {
        setTimeout(() => handleSuccess(data.email), 800);
      },
    });
  };

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

        {/* Right Side: Forgot Password Form */}
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
              <h2 className="font-headline-lg text-white uppercase">Forgot Password?</h2>
              <p className="font-body-md text-[#a0a0a0] uppercase tracking-wider">No worries, we&apos;ll send you a reset code.</p>
            </div>

            {isSuccess ? (
              <div className="space-y-6 text-center">
                <div className="border border-emerald-500/20 bg-emerald-500/10 p-6 flex flex-col items-center space-y-4">
                  <span className="material-symbols-outlined text-emerald-400 text-5xl">check_circle</span>
                  <div>
                    <h3 className="font-headline-lg text-white uppercase text-lg">OTP Sent</h3>
                    <p className="font-body-md text-[#a0a0a0] mt-1 uppercase text-xs tracking-wider">
                      We sent a code to <span className="text-white font-bold">{submittedEmail}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSuccess(submittedEmail)}
                  className="w-full bg-white text-black font-display-lg text-2xl py-4 uppercase tracking-widest transition-all duration-75 active:scale-[0.98] btn-hover-effect cursor-pointer flex items-center justify-center gap-2"
                >
                  VERIFY OTP
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border border-[#333333] bg-[#111111] px-4 py-3 text-xs text-[#a0a0a0] leading-relaxed uppercase tracking-wider">
                  Enter your registered email address and we&apos;ll send you a one-time password to reset your account credentials.
                </div>

                <div className="space-y-1">
                  <label
                    className="font-label-bold uppercase text-[10px] transition-colors duration-200"
                    style={{ color: activeInput === "email" ? "#ffffff" : "#a0a0a0" }}
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    onFocus={() => setActiveInput("email")}
                    onBlur={() => setActiveInput(null)}
                    className="login-input w-full bg-[#1a1a1a] border-0 border-b-2 border-white/20 px-4 py-4 text-white font-body-lg placeholder:text-[#666666] transition-all"
                    placeholder={placeholderEmail}
                    disabled={isPending}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#ffb4ab] mt-1 uppercase tracking-wider font-semibold">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="border border-[#93000a] bg-[#93000a]/20 px-4 py-3 text-xs font-semibold text-[#ffb4ab] uppercase tracking-wider">
                    {error instanceof Error ? error.message : "Failed to send OTP"}
                  </div>
                )}

                <button
                  className="w-full bg-white text-black font-display-lg text-lg py-4 uppercase tracking-widest transition-all duration-75 active:scale-[0.98] btn-hover-effect disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin size-5 text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      SENDING...
                    </>
                  ) : (
                    "SEND RESET CODE"
                  )}
                </button>
              </form>
            )}

            {/* Footer Link */}
            <div className="text-center pt-6">
              <p className="font-body-md text-[#a0a0a0] uppercase">
                Remember your password?
                <Link className="text-white font-bold hover:underline ml-2" href="/login">Back to Login</Link>
              </p>
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

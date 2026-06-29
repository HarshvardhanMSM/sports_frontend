"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useResetPassword } from "@/hooks/useAuth";
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

interface Rule {
  label: string;
  test: (p: string) => boolean;
}

const rules: Rule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Number", test: (p) => /\d/.test(p) },
  { label: "Special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string; color: string; bg: string } {
  const passed = rules.filter((r) => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: "", color: "", bg: "" };
  if (passed <= 2) return { score: 1, label: "Weak", color: "text-rose-400", bg: "bg-rose-500" };
  if (passed <= 3) return { score: 2, label: "Fair", color: "text-amber-400", bg: "bg-amber-500" };
  if (passed <= 4) return { score: 3, label: "Good", color: "text-yellow-400", bg: "bg-yellow-500" };
  return { score: 4, label: "Strong", color: "text-emerald-400", bg: "bg-emerald-500" };
}

function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-3 border border-[#333333] bg-[#111111] p-3">
      {/* Strength bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex gap-1 h-1.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 transition-all duration-300 ${level <= strength.score ? strength.bg : "bg-[#333333]"
                }`}
            />
          ))}
        </div>
        {strength.label && (
          <span className={`text-[10px] font-bold uppercase tracking-wider ${strength.color} min-w-[40px] text-right`}>
            {strength.label}
          </span>
        )}
      </div>

      {/* Rules */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.label}
              className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors duration-150 ${passed ? "text-emerald-400" : "text-[#666666]"
                }`}
            >
              <div className={`size-1.5 shrink-0 transition-colors duration-150 ${passed ? "bg-emerald-400" : "bg-[#333333]"}`} />
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const { data: storeSettings } = useStoreSettings();
  const { mutate: resetPassword, isPending, error, isSuccess } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [activeInput, setActiveInput] = useState<"newPassword" | "confirmPassword" | null>(null);

  const hasCustomLogo = !!storeSettings?.logoUrl;
  const logoSrc = hasCustomLogo
    ? resolveImageUrl(storeSettings.logoUrl)
    : "/assets/logos/Final%20file_Logo%20.png";
  const storeName = storeSettings?.storeName || "Jaebees Sports";
  const storeTagline = storeSettings?.storeTagline || "Manage your sports store with seamless control";

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `RESET PASSWORD | ${storeName.toUpperCase()}`;
    }
  }, [storeName]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: ResetFormValues) => {
    resetPassword({ email, otp: "", newPassword: data.newPassword });
  };

  if (!email) {
    if (typeof window !== "undefined") {
      router.push("/forgot-password");
    }
    return null;
  }

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

        {/* Right Side: Reset Password Form */}
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
              <h2 className="font-headline-lg text-white uppercase">Set new password</h2>
              <p className="font-body-md text-[#a0a0a0] uppercase tracking-wider">Create a strong password for your account.</p>
            </div>

            {isSuccess ? (
              <div className="space-y-6 text-center">
                <div className="border border-emerald-500/20 bg-emerald-500/10 p-6 flex flex-col items-center space-y-4">
                  <span className="material-symbols-outlined text-emerald-400 text-5xl">check_circle</span>
                  <div>
                    <h3 className="font-headline-lg text-white uppercase text-lg">Password Reset</h3>
                    <p className="font-body-md text-[#a0a0a0] mt-1.5 uppercase text-xs tracking-wider">
                      Your password has been updated. You can now sign in with your new credentials.
                    </p>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="w-full bg-white text-black font-display-lg text-2xl py-4 uppercase tracking-widest transition-all duration-75 active:scale-[0.98] btn-hover-effect cursor-pointer flex items-center justify-center gap-2"
                >
                  BACK TO SIGN IN
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border border-[#333333] bg-[#111111] px-4 py-3 text-xs text-[#a0a0a0] leading-relaxed uppercase tracking-wider">
                  Create a strong new password for <span className="text-white font-bold">{email}</span>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label
                    className="font-label-bold uppercase text-[10px] transition-colors duration-200"
                    style={{ color: activeInput === "newPassword" ? "#ffffff" : "#a0a0a0" }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("newPassword", { onChange: (e) => setPasswordValue(e.target.value) })}
                      type={showPassword ? "text" : "password"}
                      onFocus={() => setActiveInput("newPassword")}
                      onBlur={() => setActiveInput(null)}
                      className="login-input w-full bg-[#1a1a1a] border-0 border-b-2 border-white/20 px-4 py-4 pr-12 text-white font-body-lg placeholder:text-[#666666] transition-all"
                      placeholder="CREATE A NEW PASSWORD"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-white transition-colors duration-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff className="size-5" /> : <FiEye className="size-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-[#ffb4ab] mt-1 uppercase tracking-wider font-semibold">
                      {errors.newPassword.message}
                    </p>
                  )}
                  <PasswordStrength password={passwordValue} />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label
                    className="font-label-bold uppercase text-[10px] transition-colors duration-200"
                    style={{ color: activeInput === "confirmPassword" ? "#ffffff" : "#a0a0a0" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirm ? "text" : "password"}
                      onFocus={() => setActiveInput("confirmPassword")}
                      onBlur={() => setActiveInput(null)}
                      className="login-input w-full bg-[#1a1a1a] border-0 border-b-2 border-white/20 px-4 py-4 pr-12 text-white font-body-lg placeholder:text-[#666666] transition-all"
                      placeholder="RE-ENTER YOUR NEW PASSWORD"
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-white transition-colors duration-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirm ? <FiEyeOff className="size-5" /> : <FiEye className="size-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-[#ffb4ab] mt-1 uppercase tracking-wider font-semibold">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="border border-[#93000a] bg-[#93000a]/20 px-4 py-3 text-xs font-semibold text-[#ffb4ab] uppercase tracking-wider">
                    {error instanceof Error ? error.message : "Failed to reset password"}
                  </div>
                )}

                <button
                  className="w-full bg-white text-black font-display-lg text-2xl py-4 uppercase tracking-widest transition-all duration-75 active:scale-[0.98] btn-hover-effect disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin size-5 text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      RESETTING...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            {/* Footer Link */}
            <div className="text-center pt-6">
              <Link className="font-body-md text-[#a0a0a0] uppercase hover:text-white hover:underline cursor-pointer" href="/login">
                Back to Sign In
              </Link>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

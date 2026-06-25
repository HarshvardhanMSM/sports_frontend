"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { resolveImageUrl } from "@/lib/image";
import logo from "/assets/logos/Final%20file_Logo%20%2B%20wordmark.png";
export default function LoginPage() {
  const { data: storeSettings } = useStoreSettings();
  const hasCustomLogo = !!storeSettings?.logoUrl;
  const logoSrc = hasCustomLogo
    ? resolveImageUrl(storeSettings.logoUrl)
    : "/assets/logos/Final%20file_Logo%20%2B%20wordmark.png";
  const storeName = storeSettings?.storeName || "jaebees Sports";
  const storeTagline = storeSettings?.storeTagline || "Manage your sports store with seamless control";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      {/* Left side — Premium Hero Panel (branding & visuals) */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-6 bg-slate-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.12),transparent_50%)]" />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src={logoSrc}
                alt={storeName}
                className={`max-h-full max-w-full object-contain ${!hasCustomLogo ? "brightness-0 invert" : ""}`}
              />
            </div>
            <span className="text-lg font-bold tracking-wider text-white uppercase">{storeName}</span>
          </div>
        </div>

        {/* Feature showcase */}
        <div className="relative z-10 max-w-xl my-auto space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Admin Portal
          </span>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {storeName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">Control Panel</span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed font-medium">
            {storeTagline || "A state-of-the-art admin control panel built to oversee catalog systems, process customer orders, customize access permissions, and track live inventory."}
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-500">
            &copy; 2026 {storeName}. All rights reserved. Professional Admin System.
          </p>
        </div>
      </div>

      {/* Right side — Clean Form Panel */}
      <div className="col-span-1 lg:col-span-5 xl:col-span-6 flex items-center justify-center bg-white p-6 sm:p-12 md:p-16 relative">
        {/* Mobile top logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-indigo-50 p-1.5 flex items-center justify-center border border-indigo-100 shadow-sm overflow-hidden">
            <img
              src={logoSrc}
              alt={storeName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-wider text-slate-800 uppercase">{storeName}</span>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500 mt-2">
              Please enter your admin credentials to access your dashboard.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

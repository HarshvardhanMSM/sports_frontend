"use client";

import React from "react";
import { FiShield, FiTrendingUp, FiPackage, FiUsers } from "react-icons/fi";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const stats = [
  { label: "Products Managed", value: "2,400+", icon: FiPackage },
  { label: "Active Customers", value: "3,800+", icon: FiUsers },
  { label: "Revenue Growth", value: "18.6%", icon: FiTrendingUp },
];

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[54%] relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 65%, #6d28d9 100%)" }}>
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Large decorative circle */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <FiShield className="size-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Sportswear</span>
              <span className="ml-1 text-sm font-medium text-indigo-300">Admin</span>
            </div>
          </div>

          {/* Main copy */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                Enterprise-grade<br />
                <span className="text-indigo-300">management platform</span>
              </h1>
              <p className="mt-4 text-base text-indigo-200 leading-relaxed max-w-sm">
                A comprehensive admin solution for managing your sportswear e-commerce operations with precision and efficiency.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="size-4 text-indigo-300" />
                  </div>
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-indigo-300 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-indigo-400">
            &copy; {new Date().getFullYear()} Sportswear Admin. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex w-full lg:w-[46%] items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
              <FiShield className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">Sportswear Admin</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-100 p-8">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 mb-4">
                <div className="size-1.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Admin Portal</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

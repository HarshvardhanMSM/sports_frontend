"use client";

import React from "react";
import type { IconType } from "react-icons";

export type StatCardVariant = "gradient" | "simple";

const gradientBg: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-600",
  emerald: "from-emerald-500 to-emerald-600",
  rose: "from-rose-500 to-rose-600",
  amber: "from-amber-500 to-amber-600",
  blue: "from-blue-500 to-blue-600",
  cyan: "from-cyan-500 to-cyan-600",
  violet: "from-violet-500 to-violet-600",
  orange: "from-orange-500 to-orange-600",
};

const simpleColors: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
  red: "bg-red-50 text-red-600",
  sky: "bg-sky-50 text-sky-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: IconType;
  color?: string;
  sub?: string;
  variant?: StatCardVariant;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "indigo",
  sub,
  variant = "gradient",
}: StatCardProps) {
  if (variant === "simple") {
    const colorClass = simpleColors[color] ?? simpleColors.indigo;
    return (
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 leading-none mb-1">{value}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        </div>
      </div>
    );
  }

  const gradientClass = gradientBg[color] ?? gradientBg.indigo;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${gradientClass} opacity-5`} />
      <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-sm mb-3`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default StatCard;

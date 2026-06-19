import React from "react";

interface BadgeProps {
  color?: "success" | "warning" | "error" | "info" | string;
  size?: "sm" | "md" | string;
  children: React.ReactNode;
}

export default function Badge({
  color = "info",
  size = "md",
  children,
}: BadgeProps) {
  const colorClasses: Record<string, string> = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    warning:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    error:
      "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    info:
      "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-2 py-0.5 text-[10px] font-bold tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${
        colorClasses[color] || colorClasses.info
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      {children}
    </span>
  );
}

"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * EMPTY STATE
 *
 * A reusable, polished empty-state component for tables, lists,
 * and any section where no data is available.
 *
 * Props:
 *   icon        — React node (icon component)
 *   title       — Primary message, e.g. "No products found"
 *   description — Secondary hint text (optional)
 *   action      — Call-to-action button config (optional)
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  /** Additional class names for the outer wrapper */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {/* Icon container */}
      {icon && (
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}

      {/* Title */}
      <p className="text-base font-semibold text-slate-700">{title}</p>

      {/* Description */}
      {description && (
        <p className="mt-1 text-sm text-slate-400 max-w-xs">{description}</p>
      )}

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
            action.variant === "secondary"
              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

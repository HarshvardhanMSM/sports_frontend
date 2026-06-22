"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * QUERY ERROR BOUNDARY
 *
 * A functional component that wraps isError states from TanStack
 * Query and renders a polished error panel with a Retry button.
 *
 * Usage:
 *   const { isError, error, refetch } = useProducts();
 *
 *   if (isLoading) return <Skeleton />;
 *   if (isError) return <QueryErrorBoundary error={error} onRetry={refetch} />;
 *
 *   return <ProductTable ... />;
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { normalizeApiError, isForbiddenError, isNotFoundError } from "@/lib/errors/error-handler";
import { AccessDenied } from "@/components/common/AccessDenied";

interface QueryErrorBoundaryProps {
  error: unknown;
  onRetry?: () => void;
  /** Override message shown (default: normalized error message) */
  message?: string;
  /** Class applied to the outer wrapper */
  className?: string;
}

export function QueryErrorBoundary({
  error,
  onRetry,
  message,
  className = "bg-white rounded-2xl border border-slate-200 shadow-sm",
}: QueryErrorBoundaryProps) {
  // 403 — show dedicated access denied page
  if (isForbiddenError(error)) {
    return <AccessDenied />;
  }

  // 404 — show not found message
  if (isNotFoundError(error)) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100">
          <svg
            className="size-8 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800">Not Found</h3>
        <p className="mt-1 text-sm text-slate-500">
          The requested resource could not be found.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Generic API / network error
  const normalized = normalizeApiError(error);
  const displayMessage = message ?? normalized.message;

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-rose-50">
        <svg
          className="size-8 text-rose-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-800">
        Failed to load data
      </h3>

      {/* Message */}
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{displayMessage}</p>

      {/* Validation errors */}
      {normalized.errors.length > 0 && (
        <ul className="mt-3 text-left space-y-1">
          {normalized.errors.map((err, i) => (
            <li key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
              <span className="mt-0.5">•</span>
              <span>{err}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Retry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
              clipRule="evenodd"
            />
          </svg>
          Retry
        </button>
      )}
    </div>
  );
}

export default QueryErrorBoundary;

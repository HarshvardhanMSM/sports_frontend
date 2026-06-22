"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * ACCESS DENIED
 *
 * Professional 403 Forbidden UI shown when an API returns 403
 * or when a route guard blocks access.
 *
 * Props:
 *   title       — Override default "Access Denied" (optional)
 *   description — Override default description (optional)
 *   showBackButton — Whether to show Go Back button (default: true)
 * ─────────────────────────────────────────────────────────────────
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function AccessDenied({
  title = "Access Denied",
  description = "You do not have permission to view this page. Contact your administrator if you think this is a mistake.",
  showBackButton = true,
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Icon */}
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100">
        <svg
          className="size-10 text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>

      {/* Status code */}
      <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">
        403 Forbidden
      </p>

      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>

      {/* Description */}
      <p className="text-sm text-slate-500 max-w-sm mb-8">{description}</p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
              clipRule="evenodd"
            />
          </svg>
          Go to Dashboard
        </Link>

        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Go Back
          </button>
        )}
      </div>
    </div>
  );
}

export default AccessDenied;

"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * ERROR BOUNDARY
 *
 * Catches React render-time exceptions and displays a professional
 * fallback UI instead of a blank/crashed screen.
 *
 * Usage:
 *   Wrap any subtree (ideally the root layout) with:
 *   <ErrorBoundary>{children}</ErrorBoundary>
 *
 * Note: Must be a class component — React requires this for
 * componentDidCatch / getDerivedStateFromError.
 * ─────────────────────────────────────────────────────────────────
 */

import React from "react";
import { logError } from "@/lib/errors/error-handler";

interface Props {
  children: React.ReactNode;
  /** Optional custom fallback — defaults to the built-in crash UI */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    logError("ErrorBoundary", { error, componentStack: info.componentStack });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoBack = () => {
    window.history.back();
  };

  private handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100">
            <svg
              className="size-10 text-rose-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h1>

          {/* Description */}
          <p className="text-sm text-slate-500 mb-2">
            An unexpected error occurred while rendering this page.
          </p>

          {/* Error detail (dev only) */}
          {process.env.NODE_ENV === "development" && this.state.errorMessage && (
            <div className="mt-3 mb-4 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-left">
              <p className="text-xs font-mono text-rose-700 break-all">
                {this.state.errorMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all"
            >
              <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
              Reload Page
            </button>

            <button
              onClick={this.handleRetry}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Try Again
            </button>

            <button
              onClick={this.handleGoBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Go Back
            </button>

            <button
              onClick={this.handleGoHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * TOAST PROVIDER
 *
 * Zero-dependency, centralized toast notification system.
 *
 * Usage:
 *   1. Wrap root layout with <ToastProvider>
 *   2. Inside any component: const toast = useToast(); toast.success("Done!")
 *   3. From non-React code (Axios interceptor): showToastGlobal("error", "msg")
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ── Types ─────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  errors?: string[];
  exiting?: boolean;
}

interface ToastContextValue {
  show: (variant: ToastVariant, message: string, errors?: string[]) => void;
  dismiss: (id: string) => void;
}

// ── Context ───────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Global imperative dispatcher (for use outside React) ──────────

type ToastDispatcher = (
  variant: ToastVariant,
  message: string,
  errors?: string[]
) => void;

let _globalDispatch: ToastDispatcher | null = null;

/**
 * Imperatively show a toast from outside React components
 * (e.g. from Axios interceptors).
 */
export function showToastGlobal(
  variant: ToastVariant,
  message: string,
  errors?: string[]
): void {
  if (_globalDispatch) {
    _globalDispatch(variant, message, errors);
  }
}

// ── Styling maps ──────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, { bar: string; icon: string; text: string; bg: string }> = {
  success: {
    bar: "bg-emerald-500",
    icon: "✓",
    text: "text-emerald-700",
    bg: "bg-white border-emerald-200",
  },
  error: {
    bar: "bg-rose-500",
    icon: "✕",
    text: "text-rose-700",
    bg: "bg-white border-rose-200",
  },
  warning: {
    bar: "bg-amber-500",
    icon: "⚠",
    text: "text-amber-700",
    bg: "bg-white border-amber-200",
  },
  info: {
    bar: "bg-blue-500",
    icon: "i",
    text: "text-blue-700",
    bg: "bg-white border-blue-200",
  },
};

// ── Single Toast Item ─────────────────────────────────────────────

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const s = variantStyles[toast.variant];

  return (
    <div
      className={`
        relative flex items-start gap-3 w-full max-w-sm rounded-xl shadow-lg border
        px-4 py-3 ${s.bg}
        ${toast.exiting ? "animate-toast-out" : "animate-toast-in"}
      `}
      role="alert"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${s.bar}`} />

      {/* Icon */}
      <div
        className={`
          shrink-0 flex items-center justify-center size-6 rounded-full
          text-xs font-bold text-white ${s.bar}
        `}
      >
        {s.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-snug">
          {toast.message}
        </p>
        {toast.errors && toast.errors.length > 0 && (
          <ul className="mt-1.5 space-y-0.5">
            {toast.errors.map((err, i) => (
              <li key={i} className={`text-xs flex items-start gap-1.5 ${s.text}`}>
                <span className="mt-0.5 shrink-0">•</span>
                <span>{err}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────

const MAX_TOASTS = 5;
const AUTO_DISMISS_MS = 4500;
const EXIT_ANIMATION_MS = 300;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  const show = useCallback(
    (variant: ToastVariant, message: string, errors?: string[]) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [
          ...prev.filter((t) => !t.exiting).slice(-(MAX_TOASTS - 1)),
          { id, variant, message, errors },
        ];
        return next;
      });

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  // Register the global dispatcher
  useEffect(() => {
    _globalDispatch = show;
    return () => {
      _globalDispatch = null;
    };
  }, [show]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastPortal toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Portal renderer ───────────────────────────────────────────────

function ToastPortal({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 items-end pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastMessage toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// ── Hook ─────────────────────────────────────────────────────────

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used within <ToastProvider>");
  }
  return ctx;
}

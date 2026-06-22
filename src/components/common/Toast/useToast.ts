"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * useToast — Convenience hook for showing toast notifications.
 *
 * Returns an object with typed methods:
 *   toast.success(message)
 *   toast.error(message, errors?)
 *   toast.warning(message)
 *   toast.info(message)
 *
 * Must be used inside a component wrapped by <ToastProvider>.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback } from "react";
import { useToastContext } from "./ToastProvider";

export function useToast() {
  const { show } = useToastContext();

  const success = useCallback(
    (message: string) => show("success", message),
    [show]
  );

  const error = useCallback(
    (message: string, errors?: string[]) => show("error", message, errors),
    [show]
  );

  const warning = useCallback(
    (message: string) => show("warning", message),
    [show]
  );

  const info = useCallback(
    (message: string) => show("info", message),
    [show]
  );

  return { success, error, warning, info } as const;
}

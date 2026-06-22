/**
 * ─────────────────────────────────────────────────────────────────
 * CENTRALIZED ERROR HANDLER
 *
 * Provides:
 *   - NormalizedError type matching the backend response shape
 *   - normalizeApiError(error) — converts any thrown value into
 *     a predictable { statusCode, message, errors } object
 *   - Type guard helpers: isAuthError, isForbiddenError, isNotFoundError
 *   - logError — dev-only console.error wrapper
 * ─────────────────────────────────────────────────────────────────
 */

import { isAxiosError } from "axios";
import { ApiError } from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────

export interface NormalizedError {
  statusCode: number;
  message: string;
  errors: string[];
}

/** Shape of a backend validation / error response body. */
interface BackendErrorBody {
  statusCode?: number;
  message?: string;
  errors?: string[];
}

// ── Core normalizer ───────────────────────────────────────────────

/**
 * Converts any thrown value (ApiError, AxiosError, Error, string, unknown)
 * into a consistent NormalizedError object.
 *
 * Usage:
 *   const normalized = normalizeApiError(error);
 *   toast.error(normalized.message, normalized.errors);
 */
export function normalizeApiError(error: unknown): NormalizedError {
  // ── Already an ApiError (thrown by src/services/api.ts) ──────
  if (error instanceof ApiError) {
    const body = error.data as BackendErrorBody | undefined;
    const errors: string[] = Array.isArray(body?.errors) ? body.errors : [];
    return {
      statusCode: error.status,
      message: error.message || "An unexpected error occurred.",
      errors,
    };
  }

  // ── Raw AxiosError (e.g. from the interceptor or direct calls) ─
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as BackendErrorBody | undefined;
    const errors: string[] = Array.isArray(body?.errors) ? body.errors : [];

    // Network / timeout
    if (!error.response) {
      if (
        error.code === "ECONNABORTED" ||
        error.message?.toLowerCase().includes("timeout")
      ) {
        return { statusCode: 0, message: "Request timed out.", errors: [] };
      }
      return { statusCode: 0, message: "Unable to connect to server.", errors: [] };
    }

    const message =
      body?.message ||
      error.message ||
      "An unexpected error occurred.";

    return { statusCode: status, message, errors };
  }

  // ── Generic JS Error ──────────────────────────────────────────
  if (error instanceof Error) {
    return { statusCode: 0, message: error.message, errors: [] };
  }

  // ── String thrown ─────────────────────────────────────────────
  if (typeof error === "string") {
    return { statusCode: 0, message: error, errors: [] };
  }

  // ── Unknown ───────────────────────────────────────────────────
  return {
    statusCode: 0,
    message: "An unexpected error occurred.",
    errors: [],
  };
}

// ── Type guards ───────────────────────────────────────────────────

/** True if the error represents a 401 Unauthorized response. */
export function isAuthError(error: unknown): boolean {
  return normalizeApiError(error).statusCode === 401;
}

/** True if the error represents a 403 Forbidden response. */
export function isForbiddenError(error: unknown): boolean {
  return normalizeApiError(error).statusCode === 403;
}

/** True if the error represents a 404 Not Found response. */
export function isNotFoundError(error: unknown): boolean {
  return normalizeApiError(error).statusCode === 404;
}

/** True if the error represents a network / connectivity error. */
export function isNetworkError(error: unknown): boolean {
  return normalizeApiError(error).statusCode === 0;
}

// ── Dev-only logger ───────────────────────────────────────────────

/**
 * Logs errors to the console only in development.
 * In production, stack traces are never exposed to the user.
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context}]`, error);
  }
}

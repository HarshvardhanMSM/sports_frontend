/**
 * ─────────────────────────────────────────────────────────────────
 * API — Generic typed CRUD helpers
 *
 * Thin wrappers around axiosInstance that unwrap `.data` from the
 * Axios response so every service call returns T directly.
 *
 * Usage in a service:
 *   import { api } from "@/services/api";
 *   const products = await api.get<Product[]>("/api/products");
 * ─────────────────────────────────────────────────────────────────
 */

import { type AxiosRequestConfig, isAxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";

// ── ApiError ──────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Convert an Axios error into a clean, typed ApiError. */
export function toApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const status     = err.response?.status     ?? 0;
    const statusText = err.response?.statusText ?? "Network Error";
    const message    =
      (err.response?.data as { message?: string })?.message ??
      err.message ??
      "An unexpected error occurred.";
    return new ApiError(status, statusText, message, err.response?.data);
  }
  if (err instanceof ApiError) return err;
  return new ApiError(0, "Unknown", String(err));
}

// ── Generic helpers ───────────────────────────────────────────────

// type ParamPrimitive = string | number | boolean;

/** Convert params object to a record of strings (booleans/numbers become "true"/"1"). */
function toPlainParams(params?: object): Record<string, string> | undefined {
  if (!params) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k] = String(v);
    }
  }
  return out;
}

export const api = {
  get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance
      .get<T>(url, { params: toPlainParams(params), ...config })
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e)));
  },

  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance
      .post<T>(url, body, config)
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e)));
  },

  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance
      .put<T>(url, body, config)
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e)));
  },

  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance
      .patch<T>(url, body, config)
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e)));
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance
      .delete<T>(url, config)
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e)));
  },
};

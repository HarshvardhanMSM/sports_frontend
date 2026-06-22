/**
 * ─────────────────────────────────────────────────────────────────
 * AXIOS INSTANCE
 *
 * Single configured Axios instance used by every service.
 * - Request interceptor injects Bearer token
 * - Response interceptor handles:
 *     • 401 — silent token refresh with retry queue
 *     • 400 / 403 / 404 / 409 / 422 / 429 / 500-503 — user-facing toasts
 *     • Network errors and timeouts — user-facing toasts
 * ─────────────────────────────────────────────────────────────────
 */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { showToastGlobal } from "@/components/common/Toast/ToastProvider";

// ── Instance ──────────────────────────────────────────────────────

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001",
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

// ── Queue for requests waiting on a token refresh ─────────────────

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null) {
  for (const item of failedQueue) {
    if (error) item.reject(error);
    else item.resolve(token!);
  }
  failedQueue = [];
}

// ── Read token from persisted Zustand store ───────────────────────

function getStoredAuth() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

// ── Request Interceptor — attach Bearer token ─────────────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = getStoredAuth();
    if (auth?.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Helpers for response error body parsing ───────────────────────

/** Recursively rename _id → id in API responses (MongoDB compat). */
function normalizeIds(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(normalizeIds);
  if (obj && typeof obj === "object") {
    const cloned = { ...obj } as Record<string, unknown>;
    if ("_id" in cloned && typeof cloned._id === "string") {
      cloned.id = cloned._id as string;
      delete cloned._id;
    }
    for (const k of Object.keys(cloned)) {
      cloned[k] = normalizeIds(cloned[k]);
    }
    return cloned;
  }
  return obj;
}

/** Extract validation errors array from backend response body. */
function extractErrors(data: unknown): string[] {
  if (data && typeof data === "object" && "errors" in data) {
    const errs = (data as { errors?: unknown }).errors;
    if (Array.isArray(errs)) return errs.filter((e) => typeof e === "string");
  }
  return [];
}

/** Extract backend message from response body. */
function extractMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}

// ── Response Interceptor — 401 refresh flow + centralized error handling ──

axiosInstance.interceptors.response.use(
  (response) => {
    response.data = normalizeIds(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const responseData = error.response?.data;

    // ── 401 — Attempt silent token refresh ────────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/login") ||
        (typeof window !== "undefined" && window.location.pathname === "/login")
      ) {
        return Promise.reject(error);
      }

      const auth = getStoredAuth();
      if (!auth?.refreshToken) {
        // No refresh token — force logout
        const { useAuthStore } = await import("@/store/auth.store");
        useAuthStore.getState().logout();
        showToastGlobal("warning", "Your session has expired. Please sign in again.");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request while the refresh is in-flight
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { AuthService } = await import("@/services/auth.service");
        const response = await AuthService.refreshToken({
          refreshToken: auth.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;
        const { useAuthStore } = await import("@/store/auth.store");
        useAuthStore.getState().setTokens(accessToken, refreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { useAuthStore } = await import("@/store/auth.store");
        useAuthStore.getState().logout();
        showToastGlobal("warning", "Your session has expired. Please sign in again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Network / Timeout errors (no response object) ─────────────
    if (!error.response) {
      if (
        error.code === "ECONNABORTED" ||
        error.message?.toLowerCase().includes("timeout")
      ) {
        showToastGlobal("error", "Request timed out. Please try again.");
      } else {
        showToastGlobal("error", "Unable to connect to server. Check your connection.");
      }
      return Promise.reject(error);
    }

    // ── HTTP Error Status Codes ────────────────────────────────────
    switch (status) {
      case 400: {
        const msg = extractMessage(responseData, "Invalid request. Please check your input.");
        const errors = extractErrors(responseData);
        showToastGlobal("error", msg, errors.length ? errors : undefined);
        break;
      }

      // 401 fully handled above (refresh + redirect). No duplicate toast.

      case 403: {
        showToastGlobal("error", "You do not have permission to perform this action.");
        break;
      }

      case 404: {
        // Suppress GET 404 toasts — detail pages render inline NotFound UI.
        // Show toasts for non-GET mutations (delete, update on missing resource).
        const method = originalRequest.method?.toUpperCase();
        if (method && method !== "GET") {
          showToastGlobal("error", "Requested resource not found.");
        }
        break;
      }

      case 409: {
        const msg = extractMessage(
          responseData,
          "A conflict occurred. The resource may already exist."
        );
        showToastGlobal("error", msg);
        break;
      }

      case 422: {
        const errors = extractErrors(responseData);
        const msg = extractMessage(responseData, "Validation failed.");
        showToastGlobal("error", msg, errors.length ? errors : undefined);
        break;
      }

      case 429: {
        showToastGlobal("warning", "Too many requests. Please try again later.");
        break;
      }

      case 500:
      case 502:
      case 503: {
        showToastGlobal(
          "error",
          "Something went wrong on our servers. Please try again later."
        );
        break;
      }

      default:
        // Unknown codes — let mutation-level onError handlers deal with them
        break;
    }

    return Promise.reject(error);
  },
);

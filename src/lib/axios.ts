/**
 * ─────────────────────────────────────────────────────────────────
 * AXIOS INSTANCE
 *
 * Single configured Axios instance used by every service.
 * - Request interceptor injects Bearer token
 * - Response interceptor handles 401 with automatic token refresh
 * ─────────────────────────────────────────────────────────────────
 */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

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

// ── Response Interceptor — 401 refresh flow ───────────────────────

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

axiosInstance.interceptors.response.use(
  (response) => {
    response.data = normalizeIds(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401, if not already retried, and if we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      const auth = getStoredAuth();
      if (!auth?.refreshToken) {
        // No refresh token — force logout
        const { useAuthStore } = await import("@/store/auth.store");
        useAuthStore.getState().logout();
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
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

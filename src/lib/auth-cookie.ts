/**
 * Client-side auth cookie helpers.
 * Used by the Zustand store to sync auth state with Next.js middleware.
 */

const COOKIE_NAME = "auth-token";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax; Secure`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

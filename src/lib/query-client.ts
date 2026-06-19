/**
 * ─────────────────────────────────────────────────────────────────
 * TANSTACK QUERY — QueryClient singleton
 *
 * Created once and shared through QueryProvider.
 * ─────────────────────────────────────────────────────────────────
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 2 minutes — no re-fetch on window focus
      staleTime: 2 * 60 * 1000,
      // Keep inactive data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once before showing an error
      retry: 1,
      retryDelay: 1_000,
      // Don't re-fetch when the window regains focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * ─────────────────────────────────────────────────────────────────
 * TANSTACK QUERY — QueryClient singleton
 *
 * Created once and shared through QueryProvider.
 * - queryCache.onError logs query errors in development only.
 *   (Toasts are handled by the Axios interceptor — no double-toast.)
 * ─────────────────────────────────────────────────────────────────
 */

import { QueryCache, QueryClient } from "@tanstack/react-query";
import { logError } from "@/lib/errors/error-handler";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      logError(`QueryCache [${String(query.queryKey)}]`, error);
    },
  }),
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


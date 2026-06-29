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
      // Data is considered stale immediately so it always fetches fresh data
      staleTime: 0,
      // Do not keep inactive data in cache
      gcTime: 0,
      // Retry failed requests once before showing an error
      retry: 1,
      retryDelay: 1_000,
      // Re-fetch when the window regains focus to keep separate tabs in sync
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});


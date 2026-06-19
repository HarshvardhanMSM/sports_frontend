"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * QUERY PROVIDER
 *
 * Wraps the app with TanStack QueryClientProvider.
 * ReactQueryDevtools is only rendered in development.
 *
 * Add to root layout:
 *   <QueryProvider>{children}</QueryProvider>
 * ─────────────────────────────────────────────────────────────────
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

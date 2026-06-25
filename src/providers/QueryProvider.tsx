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

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { resolveImageUrl } from "@/lib/image";

interface QueryProviderProps {
  children: React.ReactNode;
}

function DynamicFavicon() {
  const { data: storeSettings } = useStoreSettings();

  useEffect(() => {
    if (storeSettings?.faviconUrl) {
      const faviconUrl = resolveImageUrl(storeSettings.faviconUrl);
      if (faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
      }
    }
  }, [storeSettings]);

  return null;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicFavicon />
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { ReturnAnalyticsService, returnAnalyticsKeys } from "@/services/return-analytics.service";

export function useReturnSummary() {
  return useQuery({
    queryKey: returnAnalyticsKeys.summary(),
    queryFn: () => ReturnAnalyticsService.getSummary(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReturnReasons() {
  return useQuery({
    queryKey: returnAnalyticsKeys.reasons(),
    queryFn: () => ReturnAnalyticsService.getReasons(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReturnProducts() {
  return useQuery({
    queryKey: returnAnalyticsKeys.products(),
    queryFn: () => ReturnAnalyticsService.getProducts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReturnRefunds() {
  return useQuery({
    queryKey: returnAnalyticsKeys.refunds(),
    queryFn: () => ReturnAnalyticsService.getRefunds(),
    staleTime: 5 * 60 * 1000,
  });
}

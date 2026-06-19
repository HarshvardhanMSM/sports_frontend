"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewService, reviewKeys } from "@/services/review.service";
import type { ReviewListParams } from "@/types/review.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useReviews(params?: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.list(params ?? {}),
    queryFn: () => ReviewService.getReviews(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useReview(id: string | undefined) {
  return useQuery({
    queryKey: reviewKeys.detail(id ?? ""),
    queryFn: () => ReviewService.getReview(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewService.deleteReview(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
      qc.removeQueries({ queryKey: reviewKeys.detail(id) });
    },
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewService.approveReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
    },
  });
}

export function useRejectReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewService.rejectReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
    },
  });
}

export function useHideReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewService.hideReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
    },
  });
}

export function useReviewAnalytics() {
  return useQuery({
    queryKey: reviewKeys.analytics(),
    queryFn: () => ReviewService.getReviewAnalytics(),
    staleTime: 5 * 60 * 1000,
  });
}

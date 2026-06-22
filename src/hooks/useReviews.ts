"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ReviewService, reviewKeys } from "@/services/review.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { ReviewListParams } from "@/types/review.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useReviews(params?: ReviewListParams) {
  return useQuery({
    queryKey: reviewKeys.list(params ?? {}),
    queryFn: () => ReviewService.getReviews(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
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
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReviewService.deleteReview(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
      qc.removeQueries({ queryKey: reviewKeys.detail(id) });
      toast.success("Review deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReviewService.approveReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
      toast.success("Review approved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useRejectReview() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReviewService.rejectReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
      toast.success("Review rejected.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useHideReview() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReviewService.hideReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewKeys.all() });
      toast.success("Review hidden.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
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

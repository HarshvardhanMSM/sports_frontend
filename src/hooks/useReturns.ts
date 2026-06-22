"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReturnService, returnKeys } from "@/services/return.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { ReturnListParams } from "@/types/return.types";

export function useReturns(params?: ReturnListParams) {
  return useQuery({
    queryKey: returnKeys.list(params ?? {}),
    queryFn: () => ReturnService.getReturns(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useReturn(id: string | undefined) {
  return useQuery({
    queryKey: returnKeys.detail(id ?? ""),
    queryFn: () => ReturnService.getReturn(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useApproveReturn() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReturnService.approveReturn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Return approved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useRejectReturn() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ReturnService.rejectReturn(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Return rejected.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useSchedulePickup() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; pickupDate: string; courierName?: string; notes?: string }) =>
      ReturnService.schedulePickup(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Pickup scheduled.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useMarkInTransit() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReturnService.markInTransit(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Marked in transit.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useMarkReceived() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReturnService.markReceived(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Marked received.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useProcessRefund() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; amount: string; method: string }) =>
      ReturnService.processRefund(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Refund processed.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useCompleteReturn() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => ReturnService.completeReturn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: returnKeys.all() });
      toast.success("Return completed.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

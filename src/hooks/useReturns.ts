"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReturnService, returnKeys } from "@/services/return.service";
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
  return useMutation({
    mutationFn: (id: string) => ReturnService.approveReturn(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useRejectReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ReturnService.rejectReturn(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useSchedulePickup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; pickupDate: string; courierName?: string; notes?: string }) =>
      ReturnService.schedulePickup(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useMarkInTransit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReturnService.markInTransit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useMarkReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReturnService.markReceived(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useProcessRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; amount: string; method: string }) =>
      ReturnService.processRefund(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

export function useCompleteReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReturnService.completeReturn(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: returnKeys.all() }),
  });
}

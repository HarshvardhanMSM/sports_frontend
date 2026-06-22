"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { OrderService, orderKeys } from "@/services/order.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { OrderListParams } from "@/types/order.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params ?? {}),
    queryFn: () => OrderService.getOrders(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => OrderService.getOrder(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      OrderService.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all() });
      toast.success("Order status updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      OrderService.cancelOrder(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all() });
      toast.success("Order cancelled successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

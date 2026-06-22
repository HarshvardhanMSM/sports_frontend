"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { CustomerService } from "@/services/customer.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CustomerListParams } from "@/types/customer.types";

export const customerKeys = {
  all:            ()                       => ["customers"]              as const,
  lists:          ()                       => ["customers", "list"]      as const,
  list:           (p?: CustomerListParams) => ["customers", "list", p]   as const,
  details:        ()                       => ["customers", "detail"]    as const,
  detail:         (id: string)             => ["customers", "detail", id]  as const,
  stats:          ()                       => ["customers", "stats"]     as const,
  wishlist:       (id: string)             => ["customers", "wishlist", id] as const,
};

export function useCustomers(params?: CustomerListParams) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => CustomerService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? ""),
    queryFn: () => CustomerService.getById(id!),
    enabled: !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => CustomerService.getStats(),
    staleTime: 3 * 60 * 1000,
  });
}

export function useCustomerWishlist(userId: string | null) {
  return useQuery({
    queryKey: customerKeys.wishlist(userId ?? ""),
    queryFn: () => CustomerService.getWishlist(userId!),
    enabled: !!userId,
  });
}

export function useToggleCustomerActive() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => CustomerService.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all() });
      toast.success("Customer status updated.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => CustomerService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all() });
      toast.success("Customer deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

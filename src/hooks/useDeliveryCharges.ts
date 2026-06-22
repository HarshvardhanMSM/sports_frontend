"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryChargeService, deliveryChargeKeys } from "@/services/delivery-charge.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CreateDeliveryChargeDto, UpdateDeliveryChargeDto } from "@/types/delivery-charge.types";

const STALE = 5 * 60 * 1000;

export function useDeliveryCharges() {
  return useQuery({
    queryKey: deliveryChargeKeys.list(),
    queryFn: () => DeliveryChargeService.getAll(),
    staleTime: STALE,
  });
}

export function useDeliveryCharge(id: string) {
  return useQuery({
    queryKey: deliveryChargeKeys.detail(id),
    queryFn: () => DeliveryChargeService.getById(id),
    enabled: !!id,
    staleTime: STALE,
  });
}

export function useCreateDeliveryCharge() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateDeliveryChargeDto) => DeliveryChargeService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() });
      toast.success("Delivery charge created.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateDeliveryCharge() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryChargeDto }) =>
      DeliveryChargeService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() });
      toast.success("Delivery charge updated.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteDeliveryCharge() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => DeliveryChargeService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() });
      toast.success("Delivery charge deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useToggleDeliveryCharge() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => DeliveryChargeService.toggle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() });
      toast.success("Delivery charge toggled.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeliveryChargeHistory(id: string) {
  return useQuery({
    queryKey: deliveryChargeKeys.history(id),
    queryFn: () => DeliveryChargeService.getHistory(id),
    enabled: !!id,
    staleTime: STALE,
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeliveryChargeService, deliveryChargeKeys } from "@/services/delivery-charge.service";
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
  return useMutation({
    mutationFn: (data: CreateDeliveryChargeDto) => DeliveryChargeService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() }),
  });
}

export function useUpdateDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryChargeDto }) => DeliveryChargeService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() }),
  });
}

export function useDeleteDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DeliveryChargeService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() }),
  });
}

export function useToggleDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DeliveryChargeService.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryChargeKeys.list() }),
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

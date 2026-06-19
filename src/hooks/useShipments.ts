"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShipmentService, shipmentKeys } from "@/services/shipment.service";
import type { ShipmentListParams } from "@/types/shipment.types";

export function useShipments(params?: ShipmentListParams) {
  return useQuery({
    queryKey: shipmentKeys.list(params ?? {}),
    queryFn: () => ShipmentService.getShipments(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useShipment(id: string | undefined) {
  return useQuery({
    queryKey: shipmentKeys.detail(id ?? ""),
    queryFn: () => ShipmentService.getShipment(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status: string; notes?: string }) =>
      ShipmentService.updateShipmentStatus(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: shipmentKeys.all() }),
  });
}

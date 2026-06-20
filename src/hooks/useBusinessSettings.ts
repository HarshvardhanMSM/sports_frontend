"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessSettingsService, businessSettingsKeys } from "@/services/business-settings.service";
import type { UpdateBusinessSettingsDto } from "@/types/business-settings.types";

export function useBusinessSettings() {
  return useQuery({
    queryKey: businessSettingsKeys.fetch(),
    queryFn: () => BusinessSettingsService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBusinessSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBusinessSettingsDto) => BusinessSettingsService.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: businessSettingsKeys.all() }),
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessSettingsService, businessSettingsKeys } from "@/services/business-settings.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
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
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateBusinessSettingsDto) => BusinessSettingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: businessSettingsKeys.all() });
      toast.success("Business settings saved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

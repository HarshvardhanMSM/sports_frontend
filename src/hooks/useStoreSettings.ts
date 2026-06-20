"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreSettingsService, storeSettingsKeys } from "@/services/store-settings.service";
import type { UpdateStoreSettingsDto } from "@/types/store-settings.types";

export function useStoreSettings() {
  return useQuery({
    queryKey: storeSettingsKeys.fetch(),
    queryFn: () => StoreSettingsService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStoreSettingsDto) => StoreSettingsService.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: storeSettingsKeys.all() }),
  });
}

export function useUploadLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => StoreSettingsService.uploadLogo(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: storeSettingsKeys.all() }),
  });
}

export function useUploadFavicon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => StoreSettingsService.uploadFavicon(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: storeSettingsKeys.all() }),
  });
}

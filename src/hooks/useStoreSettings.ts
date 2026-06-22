"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreSettingsService, storeSettingsKeys } from "@/services/store-settings.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
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
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateStoreSettingsDto) => StoreSettingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storeSettingsKeys.all() });
      toast.success("Store settings saved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUploadLogo() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (file: File) => StoreSettingsService.uploadLogo(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storeSettingsKeys.all() });
      toast.success("Logo uploaded successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUploadFavicon() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (file: File) => StoreSettingsService.uploadFavicon(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: storeSettingsKeys.all() });
      toast.success("Favicon uploaded successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

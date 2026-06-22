"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailSettingsService, emailSettingsKeys } from "@/services/email-settings.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { UpdateEmailSettingsDto } from "@/types/email-settings.types";

export function useEmailSettings() {
  return useQuery({
    queryKey: emailSettingsKeys.fetch(),
    queryFn: () => EmailSettingsService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateEmailSettings() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateEmailSettingsDto) => EmailSettingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailSettingsKeys.all() });
      toast.success("Email settings saved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

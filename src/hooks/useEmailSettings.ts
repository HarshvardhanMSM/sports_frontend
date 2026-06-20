"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailSettingsService, emailSettingsKeys } from "@/services/email-settings.service";
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
  return useMutation({
    mutationFn: (data: UpdateEmailSettingsDto) => EmailSettingsService.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: emailSettingsKeys.all() }),
  });
}

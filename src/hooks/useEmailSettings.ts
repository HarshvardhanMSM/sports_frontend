"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailSettingsService, emailSettingsKeys, SmtpSettingsService, smtpSettingsKeys } from "@/services/email-settings.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { UpdateEmailSettingsDto, UpdateSmtpSettingsDto, SmtpTestPayload } from "@/types/email-settings.types";

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

export function useSmtpSettings() {
  return useQuery({
    queryKey: smtpSettingsKeys.fetch(),
    queryFn: () => SmtpSettingsService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSmtpSettings() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateSmtpSettingsDto) => SmtpSettingsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: smtpSettingsKeys.all() });
      toast.success("SMTP settings saved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useTestSmtpConnection() {
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: SmtpTestPayload) => SmtpSettingsService.test(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Test email sent successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

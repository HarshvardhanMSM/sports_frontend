"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { EmailTemplateService, emailTemplateKeys } from "@/services/email-template.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { EmailTemplateListParams } from "@/types/email-template.types";

export function useEmailTemplates(params?: EmailTemplateListParams) {
  return useQuery({
    queryKey: emailTemplateKeys.list(params ?? {}),
    queryFn: () => EmailTemplateService.getTemplates(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useEmailTemplate(id: string | undefined) {
  return useQuery({
    queryKey: emailTemplateKeys.detail(id ?? ""),
    queryFn: () => EmailTemplateService.getTemplate(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useCreateEmailTemplate() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => EmailTemplateService.createTemplate(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailTemplateKeys.lists() });
      toast.success("Created successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateEmailTemplate(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => EmailTemplateService.updateTemplate(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: emailTemplateKeys.all() });
      toast.success("Updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteEmailTemplate() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => EmailTemplateService.deleteTemplate(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: emailTemplateKeys.lists() });
      qc.removeQueries({ queryKey: emailTemplateKeys.detail(id) });
      toast.success("Deleted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SocialLinksService, socialLinksKeys } from "@/services/social-links.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { UpdateSocialLinksDto } from "@/types/social-links.types";

export function useSocialLinks() {
  return useQuery({
    queryKey: socialLinksKeys.fetch(),
    queryFn: () => SocialLinksService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSocialLinks() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateSocialLinksDto) => SocialLinksService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: socialLinksKeys.all() });
      toast.success("Social links saved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

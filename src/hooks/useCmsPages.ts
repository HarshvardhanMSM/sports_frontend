"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CmsService, cmsKeys } from "@/services/cms.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CmsPageListParams, CreateCmsPageRequest, UpdateCmsPageRequest } from "@/types/cms.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useCmsPages(params?: CmsPageListParams) {
  return useQuery({
    queryKey: cmsKeys.list(params ?? {}),
    queryFn: () => CmsService.getPages(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useCmsPage(id: string | undefined) {
  return useQuery({
    queryKey: cmsKeys.detail(id ?? ""),
    queryFn: () => CmsService.getPage(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreateCmsPage() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateCmsPageRequest) => CmsService.createPage(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cmsKeys.all() });
      toast.success("CMS page created successfully.");
      router.push("/cms");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateCmsPage(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateCmsPageRequest) => CmsService.updatePage(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cmsKeys.all() });
      qc.removeQueries({ queryKey: cmsKeys.detail(id) });
      toast.success("CMS page updated successfully.");
      router.push("/cms");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteCmsPage() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => CmsService.deletePage(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: cmsKeys.all() });
      qc.removeQueries({ queryKey: cmsKeys.detail(id) });
      toast.success("CMS page deleted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

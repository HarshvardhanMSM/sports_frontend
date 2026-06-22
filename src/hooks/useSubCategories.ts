"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubCategoryService, subCategoryKeys } from "@/services/sub-category.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { SubCategoryListParams } from "@/types/sub-category.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useSubCategories(params?: SubCategoryListParams, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: subCategoryKeys.list(params ?? {}),
    queryFn: () => SubCategoryService.getSubCategories(params),
    staleTime: 0,
    refetchOnMount: "always",
    enabled: opts?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useSubCategory(id: string | undefined) {
  return useQuery({
    queryKey: subCategoryKeys.detail(id ?? ""),
    queryFn: () => SubCategoryService.getSubCategory(id!),
    enabled: !!id && id !== "undefined",
    staleTime: STALE_DETAIL,
  });
}

export function useCreateSubCategory() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: Parameters<typeof SubCategoryService.createSubCategory>[0]) =>
      SubCategoryService.createSubCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subCategoryKeys.all() });
      toast.success("Sub-category created successfully.");
      router.push("/sub-categories");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateSubCategory(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: Parameters<typeof SubCategoryService.updateSubCategory>[1]) =>
      SubCategoryService.updateSubCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subCategoryKeys.all() });
      toast.success("Sub-category updated successfully.");
      router.push("/sub-categories");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteSubCategory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => SubCategoryService.deleteSubCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subCategoryKeys.all() });
      toast.success("Sub-category deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

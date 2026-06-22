"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CategoryService, categoryKeys } from "@/services/category.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CategoryListParams } from "@/types/category.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useCategories(params?: CategoryListParams) {
  return useQuery({
    queryKey: categoryKeys.list(params ?? {}),
    queryFn: () => CategoryService.getCategories(params),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id ?? ""),
    queryFn: () => CategoryService.getCategory(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (formData: FormData) => CategoryService.createCategory(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success("Category created successfully.");
      router.push("/categories");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (formData: FormData) => CategoryService.updateCategory(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success("Category updated successfully.");
      router.push("/categories");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateCategoryJson(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => CategoryService.updateCategoryJson(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all() });
      toast.success("Category updated successfully.");
      router.push("/categories");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all() });
      qc.removeQueries({ queryKey: categoryKeys.detail(id) });
      toast.success("Category deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

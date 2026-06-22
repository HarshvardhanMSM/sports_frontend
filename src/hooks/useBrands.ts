"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BrandService, brandKeys } from "@/services/brand.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { BrandListParams } from "@/types/brand.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useBrands(params?: BrandListParams) {
  return useQuery({
    queryKey: brandKeys.list(params ?? {}),
    queryFn: () => BrandService.getBrands(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useBrand(id: string | undefined) {
  return useQuery({
    queryKey: brandKeys.detail(id ?? ""),
    queryFn: () => BrandService.getBrand(id!),
    enabled: !!id,
    staleTime: STALE_DETAIL,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (formData: FormData) => BrandService.createBrand(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all() });
      toast.success("Brand created successfully.");
      router.push("/brands");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateBrand(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (formData: FormData) => BrandService.updateBrand(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all() });
      toast.success("Brand updated successfully.");
      router.push("/brands");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateBrandJson(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => BrandService.updateBrandJson(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all() });
      toast.success("Brand updated successfully.");
      router.push("/brands");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useBrandCategories(id: string | undefined) {
  return useQuery({
    queryKey: brandKeys.categories(id ?? ""),
    queryFn: () => BrandService.getBrandCategories(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => BrandService.deleteBrand(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: brandKeys.all() });
      qc.removeQueries({ queryKey: brandKeys.detail(id) });
      toast.success("Brand deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

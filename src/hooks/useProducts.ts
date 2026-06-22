"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ProductService, productKeys } from "@/services/product.service";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductListParams,
} from "@/types/product.types";

const STALE = 3 * 60 * 1000;

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn:  () => ProductService.getProducts(params),
    staleTime: STALE,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string | undefined) {
  const valid = !!id && id !== "undefined";
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn:  () => ProductService.getProduct(id!),
    enabled:  valid,
    staleTime: STALE,
  });
}

export function useCreateProduct(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => ProductService.createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      onSuccess?.();
    },
  });
}

export function useUpdateProduct(id: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductRequest) => ProductService.updateProduct(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export function useDeleteProduct(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.removeQueries({ queryKey: productKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export function usePublishProduct(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductService.publishProduct(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      onSuccess?.();
    },
  });
}

export function useArchiveProduct(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProductService.archiveProduct(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      onSuccess?.();
    },
  });
}

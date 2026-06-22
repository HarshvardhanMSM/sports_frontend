"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CollectionService, collectionKeys } from "@/services/collection.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CollectionListParams } from "@/types/collection.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useCollections(params?: CollectionListParams) {
  return useQuery({
    queryKey: collectionKeys.list(params ?? {}),
    queryFn: () => CollectionService.getCollections(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useCollection(id: string | undefined) {
  return useQuery({
    queryKey: collectionKeys.detail(id ?? ""),
    queryFn: () => CollectionService.getCollection(id!),
    enabled: !!id && id !== "undefined",
    staleTime: STALE_DETAIL,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: Parameters<typeof CollectionService.createCollection>[0]) =>
      CollectionService.createCollection(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      toast.success("Collection created successfully.");
      router.push("/collections");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateCollection(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: Parameters<typeof CollectionService.updateCollection>[1]) =>
      CollectionService.updateCollection(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      toast.success("Collection updated successfully.");
      router.push("/collections");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => CollectionService.deleteCollection(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      qc.removeQueries({ queryKey: collectionKeys.detail(id) });
      toast.success("Collection deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

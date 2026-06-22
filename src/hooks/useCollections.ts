"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CollectionService, collectionKeys } from "@/services/collection.service";
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
  return useMutation({
    mutationFn: (data: Parameters<typeof CollectionService.createCollection>[0]) =>
      CollectionService.createCollection(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      router.push("/collections");
    },
  });
}

export function useUpdateCollection(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Parameters<typeof CollectionService.updateCollection>[1]) =>
      CollectionService.updateCollection(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      router.push("/collections");
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CollectionService.deleteCollection(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: collectionKeys.all() });
      qc.removeQueries({ queryKey: collectionKeys.detail(id) });
    },
  });
}

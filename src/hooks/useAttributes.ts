"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AttributeService, attributeKeys } from "@/services/attribute.service";
import type { AttributeListParams } from "@/types/attribute.types";

const STALE_DETAIL = 3 * 60 * 1000;

export function useAttributes(params?: AttributeListParams) {
  return useQuery({
    queryKey: attributeKeys.list(params ?? {}),
    queryFn: () => AttributeService.getAttributes(params),
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });
}

export function useAttribute(id: string | undefined) {
  return useQuery({
    queryKey: attributeKeys.detail(id ?? ""),
    queryFn: () => AttributeService.getAttribute(id!),
    enabled: !!id && id !== "undefined",
    staleTime: STALE_DETAIL,
  });
}

export function useCreateAttribute() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Parameters<typeof AttributeService.createAttribute>[0]) =>
      AttributeService.createAttribute(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attributeKeys.all() });
      router.push("/attributes");
    },
  });
}

export function useUpdateAttribute(id: string) {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Parameters<typeof AttributeService.updateAttribute>[1]) =>
      AttributeService.updateAttribute(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attributeKeys.all() });
      router.push("/attributes");
    },
  });
}

export function useDeleteAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AttributeService.deleteAttribute(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: attributeKeys.all() });
    },
  });
}

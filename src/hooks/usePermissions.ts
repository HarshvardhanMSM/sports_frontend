"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PermissionService, permissionKeys } from "@/services/permission.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CreatePermissionPayload } from "@/services/permission.service";

const STALE = 5 * 60 * 1000;

/** Code-defined permissions (used in the Roles page permission grid). */
export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.code(),
    queryFn: () => PermissionService.getCodePermissions(),
    staleTime: STALE,
  });
}

/** All permissions from the database. */
export function useAllPermissions() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () => PermissionService.getAllPermissions(),
    staleTime: STALE,
  });
}

/** Single permission by ID. */
export function usePermission(id: string | undefined) {
  return useQuery({
    queryKey: permissionKeys.detail(id ?? ""),
    queryFn: () => PermissionService.getPermission(id!),
    enabled: !!id,
    staleTime: STALE,
  });
}

export function useCreatePermission() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreatePermissionPayload) => PermissionService.createPermission(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permissionKeys.list() });
      qc.invalidateQueries({ queryKey: permissionKeys.code() });
      toast.success("Permission created successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdatePermission() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePermissionPayload }) =>
      PermissionService.updatePermission(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permissionKeys.list() });
      qc.invalidateQueries({ queryKey: permissionKeys.code() });
      toast.success("Permission updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => PermissionService.deletePermission(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permissionKeys.list() });
      qc.invalidateQueries({ queryKey: permissionKeys.code() });
      toast.success("Permission deleted.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * useRoles — TanStack Query hooks for roles, admin users, audit logs
 * ─────────────────────────────────────────────────────────────────
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService, roleKeys } from "@/services/role.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AuditSeverity,
} from "@/types/role.types";
import type { ListParams } from "@/types/common.types";

const STALE = 5 * 60 * 1000; // 5 minutes — roles change infrequently

// ── Role Hooks ────────────────────────────────────────────────────

/** All roles list. */
export function useRoles() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn:  () => RoleService.getRoles(),
    staleTime: STALE,
  });
}

/** Single role detail. */
export function useRole(id: string | undefined) {
  return useQuery({
    queryKey: roleKeys.detail(id ?? ""),
    queryFn:  () => RoleService.getRole(id!),
    enabled:  !!id,
    staleTime: STALE,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => RoleService.createRole(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      toast.success("Role created successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateRole(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => RoleService.updateRole(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
      toast.success("Role updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => RoleService.deleteRole(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.removeQueries({ queryKey: roleKeys.detail(id) });
      toast.success("Role deleted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Admin User Hooks ──────────────────────────────────────────────

export function useAdminRoles() {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn:  () => RoleService.getAdminRoles(),
    staleTime: STALE,
  });
}

export function useAdminUser(id: string | undefined) {
  return useQuery({
    queryKey: roleKeys.admin(id ?? ""),
    queryFn:  () => RoleService.getAdminUser(id!),
    enabled:  !!id,
    staleTime: STALE,
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateAdminUserRequest) => RoleService.createAdminUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.adminsList() });
      toast.success("Admin user created successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateAdminUser(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateAdminUserRequest) => RoleService.updateAdminUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.adminsList() });
      qc.invalidateQueries({ queryKey: roleKeys.admin(id) });
      toast.success("Admin user updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => RoleService.deleteAdminUser(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: roleKeys.adminsList() });
      qc.removeQueries({ queryKey: roleKeys.admin(id) });
      toast.success("Admin user deleted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useResetAdminPassword(id: string) {
  const toast = useToast();
  return useMutation({
    mutationFn: (newPassword: string) => RoleService.resetAdminPassword(id, newPassword),
    onSuccess: () => {
      toast.success("Admin password reset successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Role Permission Hooks ─────────────────────────────────────────

export function useAssignRolePermissions(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (permissionSlugs: string[]) => RoleService.assignRolePermissions(id, permissionSlugs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
      toast.success("Permissions assigned successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useRemoveRolePermissions(id: string) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (permissionSlugs: string[]) => RoleService.removeRolePermissions(id, permissionSlugs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
      toast.success("Permissions removed successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

// ── Audit Log Hook ────────────────────────────────────────────────

export function useAuditLogs(params?: ListParams & { module?: string; severity?: AuditSeverity }) {
  return useQuery({
    queryKey: [...roleKeys.auditLogs(), params],
    queryFn:  () => RoleService.getAuditLogs(params),
    staleTime: 60_000, // 1 min — logs are written frequently
  });
}

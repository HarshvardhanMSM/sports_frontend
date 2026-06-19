"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * useRoles — TanStack Query hooks for roles, admin users, audit logs
 * ─────────────────────────────────────────────────────────────────
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService, roleKeys } from "@/services/role.service";
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
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => RoleService.createRole(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.list() }),
  });
}

export function useUpdateRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => RoleService.updateRole(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RoleService.deleteRole(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.removeQueries({ queryKey: roleKeys.detail(id) });
    },
  });
}

// ── Admin User Hooks ──────────────────────────────────────────────

export function useAdminUsers(params?: ListParams) {
  return useQuery({
    queryKey: roleKeys.adminsList(),
    queryFn:  () => RoleService.getAdminUsers(params),
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
  return useMutation({
    mutationFn: (data: CreateAdminUserRequest) => RoleService.createAdminUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.adminsList() }),
  });
}

export function useUpdateAdminUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAdminUserRequest) => RoleService.updateAdminUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.adminsList() });
      qc.invalidateQueries({ queryKey: roleKeys.admin(id) });
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RoleService.deleteAdminUser(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: roleKeys.adminsList() });
      qc.removeQueries({ queryKey: roleKeys.admin(id) });
    },
  });
}

export function useResetAdminPassword(id: string) {
  return useMutation({
    mutationFn: (newPassword: string) => RoleService.resetAdminPassword(id, newPassword),
  });
}

// ── Role Permission Hooks ─────────────────────────────────────────

export function useAssignRolePermissions(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissionSlugs: string[]) => RoleService.assignRolePermissions(id, permissionSlugs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
    },
  });
}

export function useRemoveRolePermissions(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissionSlugs: string[]) => RoleService.removeRolePermissions(id, permissionSlugs),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.list() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
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

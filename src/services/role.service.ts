/**
 * ─────────────────────────────────────────────────────────────────
 * ROLE SERVICE + QUERY KEYS
 * ─────────────────────────────────────────────────────────────────
 */

import { api } from "./api";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  AuditLog,
  AuditSeverity,
} from "@/types/role.types";
import type { ListParams, PaginatedResponse } from "@/types/common.types";

// ── Query Keys ────────────────────────────────────────────────────

export const roleKeys = {
  all:        ()           => ["roles"]                    as const,
  list:       ()           => ["roles", "list"]            as const,
  detail:     (id: string) => ["roles", "detail", id]     as const,
  admins:     ()           => ["admin-users"]              as const,
  adminsList: ()           => ["admin-users", "list"]      as const,
  admin:      (id: string) => ["admin-users", "detail", id] as const,
  auditLogs:  ()           => ["audit-logs"]               as const,
};

// ── Response wrapper ──────────────────────────────────────────────

interface ApiListResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// ── Role CRUD ─────────────────────────────────────────────────────

export const RoleService = {
  /** GET /admin/roles */
  getRoles() {
    return api.get<ApiListResponse<Role[]>>("/admin/roles").then((res) => res.data);
  },

  /** GET /admin/roles/:id */
  getRole(id: string) {
    return api.get<ApiListResponse<Role>>(`/admin/roles/${id}`).then((res) => res.data);
  },

  /** POST /api/roles */
  createRole(data: CreateRoleRequest) {
    return api.post<Role>("/admin/roles", data);
  },

  /** PATCH /api/roles/:id */
  updateRole(id: string, data: UpdateRoleRequest) {
    return api.patch<Role>(`/admin/roles/${id}`, data);
  },

  /** DELETE /api/roles/:id */
  deleteRole(id: string) {
    return api.delete<void>(`/admin/roles/${id}`);
  },

  // ── Roles (used in assign modals) ──────────────────────────────

  /** GET /admin/roles */
  getAdminRoles() {
    return api.get<ApiListResponse<Role[]>>("/admin/roles").then((r) => r.data);
  },

  /** GET /api/admin-users/:id */
  getAdminUser(id: string) {
    return api.get<AdminUser>(`/api/admin-users/${id}`);
  },

  /** POST /api/admin-users */
  createAdminUser(data: CreateAdminUserRequest) {
    return api.post<AdminUser>("/api/admin-users", data);
  },

  /** PUT /api/admin-users/:id */
  updateAdminUser(id: string, data: UpdateAdminUserRequest) {
    return api.put<AdminUser>(`/api/admin-users/${id}`, data);
  },

  /** DELETE /api/admin-users/:id */
  deleteAdminUser(id: string) {
    return api.delete<void>(`/api/admin-users/${id}`);
  },

  /** PATCH /api/admin-users/:id/reset-password */
  resetAdminPassword(id: string, newPassword: string) {
    return api.patch<void>(`/api/admin-users/${id}/reset-password`, { newPassword });
  },

  // ── Role Permissions ───────────────────────────────────────────

  /** POST /admin/roles/:id/permissions — assign permissions to a role */
  assignRolePermissions(id: string, permissionSlugs: string[]) {
    return api.post<void>(`/admin/roles/${id}/permissions`, { permissionSlugs });
  },

  /** DELETE /admin/roles/:id/permissions — remove permissions from a role */
  removeRolePermissions(id: string, permissionSlugs: string[]) {
    return api.delete<void>(`/admin/roles/${id}/permissions`, { data: { permissionSlugs } });
  },

  // ── Audit Logs ─────────────────────────────────────────────────

  /** GET /api/audit-logs */
  getAuditLogs(params?: ListParams & { module?: string; severity?: AuditSeverity }) {
    return api.get<PaginatedResponse<AuditLog>>("/api/audit-logs", params);
  },
};

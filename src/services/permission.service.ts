import { api } from "./api";
import type { PermissionSlug } from "@/types/role.types";

export const permissionKeys = {
  all:       () => ["permissions"]                as const,
  code:      () => ["permissions", "code"]         as const,
  list:      () => ["permissions", "list"]         as const,
  detail:    (id: string) => ["permissions", "detail", id] as const,
};

export interface PermissionsListPayload {
  permissions: PermissionSlug[];
  totalPermissions?: number;
  totalModules?: number;
}

interface PermissionsResponse {
  statusCode: number;
  message: string;
  data: PermissionsListPayload;
}

interface SinglePermissionResponse {
  statusCode: number;
  message: string;
  data: PermissionSlug;
}

export interface CreatePermissionPayload {
  name: string;
  slug: string;
  module: string;
}

export const PermissionService = {
  /** GET /admin/permissions/code — code-defined permissions */
  getCodePermissions() {
    return api.get<PermissionsResponse>("/admin/permissions/code").then((res) => res.data);
  },

  /** GET /admin/permissions — all permissions */
  getAllPermissions() {
    return api.get<PermissionsResponse>("/admin/permissions").then((res) => res.data);
  },

  /** GET /admin/permissions/:id */
  getPermission(id: string) {
    return api.get<SinglePermissionResponse>(`/admin/permissions/${id}`).then((res) => res.data);
  },

  /** POST /admin/permissions */
  createPermission(data: CreatePermissionPayload) {
    return api.post<PermissionSlug>("/admin/permissions", data);
  },

  /** PUT /admin/permissions/:id */
  updatePermission(id: string, data: CreatePermissionPayload) {
    return api.put<PermissionSlug>(`/admin/permissions/${id}`, data);
  },

  /** DELETE /admin/permissions/:id */
  deletePermission(id: string) {
    return api.delete<void>(`/admin/permissions/${id}`);
  },
};

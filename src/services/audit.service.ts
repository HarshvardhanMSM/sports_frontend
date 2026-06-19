import { api } from "./api";
import type { AuditListResponse, AuditSingleResponse } from "@/types/audit.types";

export const auditKeys = {
  all:       ()                         => ["audit-logs"]                    as const,
  lists:     ()                         => ["audit-logs", "list"]            as const,
  list:      (p?: Record<string, string>) => ["audit-logs", "list", p]       as const,
  details:   ()                         => ["audit-logs", "detail"]          as const,
  detail:    (id: string)               => ["audit-logs", "detail", id]      as const,
  entity:    (type: string, id: string) => ["audit-logs", "entity", type, id] as const,
};

export const AuditService = {
  getLogs(params?: Record<string, string>) {
    return api.get<AuditListResponse>("/admin/audit-logs", params);
  },

  getLog(id: string) {
    return api.get<AuditSingleResponse>(`/admin/audit-logs/${id}`);
  },

  getEntityLogs(entityType: string, entityId: string) {
    return api.get<AuditListResponse>(`/admin/audit-logs/entity/${entityType}/${entityId}`);
  },
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditService, auditKeys } from "@/services/audit.service";

export function useAuditLogs(params?: Record<string, string>) {
  return useQuery({
    queryKey: auditKeys.list(params ?? {}),
    queryFn: () => AuditService.getLogs(params),
    staleTime: 30_000,
    refetchOnMount: "always",
  });
}

export function useAuditLog(id: string | undefined) {
  return useQuery({
    queryKey: auditKeys.detail(id ?? ""),
    queryFn: () => AuditService.getLog(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEntityAuditLogs(entityType: string | undefined, entityId: string | undefined) {
  return useQuery({
    queryKey: auditKeys.entity(entityType ?? "", entityId ?? ""),
    queryFn: () => AuditService.getEntityLogs(entityType!, entityId!),
    enabled: !!entityType && !!entityId,
    staleTime: 30_000,
  });
}

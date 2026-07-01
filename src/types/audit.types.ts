export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  module: string;
  severity: string;
  ipAddress: string;
  entityType?: string;
  entityId?: string;
  userAgent?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  user?: AuditUser;
}

export interface AuditUser {
  id: string;
  name: string;
}

export interface AuditListResponse {
  statusCode: number;
  message: string;
  data: {
    logs: AuditEntry[];
    total: number;
    totalLogs: number;
    page: number;
    limit: number;
    todayLogs: number;
    thisWeekLogs: number;
    criticalEvents: number;
  };
}

export interface AuditSingleResponse {
  statusCode: number;
  message: string;
  data: AuditEntry;
}

export interface AuditSummary {
  totalLogs: number;
  todayCount: number;
  weekCount: number;
  criticalCount: number;
}

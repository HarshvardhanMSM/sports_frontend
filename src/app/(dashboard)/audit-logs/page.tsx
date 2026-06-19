"use client";

import React, { useState, useMemo } from "react";
import { FiRefreshCw, FiAlertCircle, FiDownload } from "react-icons/fi";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import type { AuditEntry } from "@/types/audit.types";
import AuditStatsCards from "@/features/audit/components/AuditStatsCards";
import AuditFilters from "@/features/audit/components/AuditFilters";
import AuditTable from "@/features/audit/components/AuditTable";
import Pagination from "@/components/ui/pagination/Pagination";

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isRefetching, refetch } = useAuditLogs();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const allLogs: AuditEntry[] = Array.isArray(raw) ? raw : [];

  const filtered = useMemo(() => {
    return allLogs.filter((log) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        || (log.user?.name ?? "").toLowerCase().includes(q)
        || log.action.toLowerCase().includes(q)
        || log.module.toLowerCase().includes(q);
      const matchesModule = moduleFilter === "All Modules" || log.module === moduleFilter;
      const matchesAction = actionFilter === "All Actions" || (log.action ?? "").toUpperCase() === actionFilter;
      return matchesSearch && matchesModule && matchesAction;
    });
  }, [allLogs, search, moduleFilter, actionFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return {
      totalLogs: allLogs.length,
      todayCount: allLogs.filter((l) => l.timestamp && new Date(l.timestamp) >= todayStart).length,
      weekCount: allLogs.filter((l) => l.timestamp && new Date(l.timestamp) >= weekStart).length,
      criticalCount: allLogs.filter((l) => (l.action ?? "").toUpperCase() === "DELETE" || (l.action ?? "").toUpperCase() === "REJECT").length,
    };
  }, [allLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Complete record of all administrative actions taken across the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <FiDownload className="size-4" />
            Export
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load audit logs</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <AuditStatsCards {...stats} />

          <AuditFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            moduleFilter={moduleFilter}
            onModuleFilterChange={(v) => { setModuleFilter(v); setPage(1); }}
            actionFilter={actionFilter}
            onActionFilterChange={(v) => { setActionFilter(v); setPage(1); }}
            total={allLogs.length}
            filtered={filtered.length}
          />

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <AuditTable logs={paginated} />
          )}

          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

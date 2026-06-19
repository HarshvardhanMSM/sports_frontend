"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiList } from "react-icons/fi";
import { useEntityAuditLogs } from "@/hooks/useAuditLogs";
import AuditTimeline from "@/features/audit/components/AuditTimeline";
import AuditTable from "@/features/audit/components/AuditTable";
import Pagination from "@/components/ui/pagination/Pagination";

export default function EntityHistoryPage() {
  const params = useParams();
  const entityType = params?.entityType as string | undefined;
  const entityId = params?.entityId as string | undefined;
  const [page, setPage] = React.useState(1);

  const { data, isLoading, error, refetch } = useEntityAuditLogs(entityType, entityId);

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const logs = Array.isArray(raw) ? raw : [];

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = logs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/audit-logs"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Entity History</h1>
          <p className="text-sm text-slate-500">
            {entityType} — <span className="font-mono">{entityId}</span>
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading entity history...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load entity history</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiList className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No activity history found</h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            No audit log entries found for this {entityType}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AuditTable logs={paginated} />
            {totalPages > 1 && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                total={logs.length}
                limit={PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </div>
          <div className="space-y-6">
            <AuditTimeline logs={logs} entityType={entityType ?? ""} entityId={entityId ?? ""} />
          </div>
        </div>
      )}
    </div>
  );
}

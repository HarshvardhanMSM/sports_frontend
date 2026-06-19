"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiList } from "react-icons/fi";
import { useAuditLog } from "@/hooks/useAuditLogs";
import AuditDetailsCard from "@/features/audit/components/AuditDetailsCard";
import JsonViewer from "@/features/audit/components/JsonViewer";

export default function AuditLogDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data, isLoading, error, refetch } = useAuditLog(id);

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const entry = !Array.isArray(raw) && raw && typeof raw === "object" && "id" in raw
    ? raw as import("@/types/audit.types").AuditEntry
    : null;

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Audit Log Details</h1>
          <p className="text-sm text-slate-500">{isLoading ? "Loading..." : id}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading audit log...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load audit log</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : !entry ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiList className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Audit log not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The requested audit log entry does not exist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AuditDetailsCard entry={entry as any} />
            {(entry.oldValues || entry.newValues) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Change History</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <JsonViewer data={entry.oldValues ?? null} title="Before Changes" accent="rose" />
                  <JsonViewer data={entry.newValues ?? null} title="After Changes" accent="emerald" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Entity</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <FiList className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{entry.module}</p>
                    <p className="text-xs text-slate-400">{entry.action}</p>
                  </div>
                </div>
                {entry.entityType && entry.entityId ? (
                  <Link
                    href={`/audit-logs/entity/${entry.entityType}/${entry.entityId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View full entity history →
                  </Link>
                ) : (
                  <p className="text-xs text-slate-400">No entity reference</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

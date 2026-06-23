"use client";

import React from "react";
import { FiClock,  FiBox, FiMonitor, FiGlobe } from "react-icons/fi";
import type { AuditEntry } from "@/types/audit.types";
import ActionBadge from "./ActionBadge";

interface Props {
  entry: AuditEntry;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-100 first:border-t-0">
      <div className="px-6 py-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function AuditDetailsCard({ entry }: Props) {
  const initials = entry.user?.name
    ? entry.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Activity Details</h2>
          <ActionBadge action={entry.action} />
        </div>
      </div>

      {/* Activity Information */}
      <Section title="Activity Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Log ID</p>
              <p className="text-sm font-mono font-semibold text-slate-700 truncate">{entry.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Timestamp</p>
              <p className="text-sm font-semibold text-slate-700">{new Date(entry.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Severity</p>
              <p className="text-sm font-semibold text-slate-700 capitalize">{entry.severity ?? "info"}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* User Information */}
      <Section title="User Information">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 max-w-md">
          <div className="size-9 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{entry.user?.name ?? "Unknown User"}</p>
            <p className="text-xs font-mono text-slate-400">{entry.user?.id ?? "—"}</p>
          </div>
        </div>
      </Section>

      {/* Entity Information */}
      <Section title="Entity Information">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 max-w-md">
          <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <FiBox className="size-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{entry.module}</p>
            {entry.entityType && (
              <p className="text-xs text-slate-400">
                {entry.entityType}{entry.entityId ? <> — <span className="font-mono">{entry.entityId}</span></> : null}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* System Information */}
      <Section title="System Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <FiMonitor className="size-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IP Address</p>
              <p className="text-sm font-mono text-slate-700">{entry.ipAddress}</p>
            </div>
          </div>
          {entry.userAgent && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <FiGlobe className="size-4 text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">User Agent</p>
                <p className="text-xs font-mono text-slate-600 truncate">{entry.userAgent}</p>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

"use client";

import React from "react";
import { FiClock, FiUser } from "react-icons/fi";
import type { AuditEntry } from "@/types/audit.types";
import ActionBadge from "./ActionBadge";

interface Props {
  logs: AuditEntry[];
  entityType: string;
  entityId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditTimeline({ logs, entityType, entityId }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Entity Timeline</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {entityType} — <span className="font-mono">{entityId}</span>
        </p>
      </div>
      <div className="p-6">
        {logs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No activity history found for this entity.</p>
          </div>
        ) : (
          <div className="relative">
            {logs.map((log, i) => {
              const isLast = i === logs.length - 1;
              const initials = (log.user?.name ?? "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div key={log.id} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                  {!isLast && (
                    <div className="absolute left-[15px] top-7 w-0.5 h-full bg-slate-200 -z-10" />
                  )}
                  <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-indigo-700">
                    {initials}
                  </div>
                  <div className="pt-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ActionBadge action={log.action} />
                      <span className="text-xs text-slate-400 font-mono">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{log.user?.name ?? "Unknown"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="size-3" /> {log.module}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiUser className="size-3" /> {log.severity ?? "info"}
                      </span>
                    </div>
                    {log.ipAddress && (
                      <p className="text-xs font-mono text-slate-400 mt-0.5">IP: {log.ipAddress}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

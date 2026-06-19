"use client";

import React from "react";
import Link from "next/link";
import { FiEye, FiList } from "react-icons/fi";
import type { AuditEntry } from "@/types/audit.types";
import ActionBadge from "./ActionBadge";

interface Props {
  logs: AuditEntry[];
  onViewDetails?: (log: AuditEntry) => void;
}

const MODULE_COLORS: Record<string, string> = {
  Catalog: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  "User Management": "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  Inventory: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Orders: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Marketing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Content: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  Settings: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  Customers: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
};

function ModuleBadge({ module }: { module: string }) {
  const cls = MODULE_COLORS[module] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {module}
    </span>
  );
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditTable({ logs }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Module</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => {
              const initials = (log.user?.name ?? "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <tr key={log.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                    {log.timestamp ? formatTimestamp(log.timestamp) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{log.user?.name ?? "Unknown"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><ActionBadge action={log.action ?? "UNKNOWN"} /></td>
                  <td className="px-5 py-4"><ModuleBadge module={log.module ?? "Unknown"} /></td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{log.ipAddress ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/audit-logs/${log.id}`}
                      className="size-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="View Details"
                    >
                      <FiEye className="size-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FiList className="size-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">No audit logs found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

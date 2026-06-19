"use client";

import React from "react";

interface Props {
  data: Record<string, unknown> | null | undefined;
  title: string;
  accent: "emerald" | "rose";
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

export default function JsonViewer({ data, title, accent }: Props) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <p className="text-xs text-slate-400">No changes recorded.</p>
      </div>
    );
  }

  const borderColor = accent === "emerald" ? "border-emerald-200" : "border-rose-200";
  const bgColor = accent === "emerald" ? "bg-emerald-50/50" : "bg-rose-50/50";
  const dotColor = accent === "emerald" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className={`p-4 rounded-xl ${bgColor} border ${borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`size-1.5 rounded-full ${dotColor}`} />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      </div>
      <div className="space-y-1.5">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-[140px_1fr] gap-2 text-xs">
            <span className="font-mono font-semibold text-slate-500 truncate">{key}</span>
            <span className="font-mono text-slate-700 break-all">{formatValue(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface Props {
  data: Record<string, unknown> | null | undefined;
  title: string;
  accent: "emerald" | "rose";
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function Row({ k, v }: { k: string; v: unknown }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 text-xs">
      <span className="font-mono font-semibold text-slate-500 truncate pt-px">{k}</span>
      <ValueDisplay value={v} />
    </div>
  );
}

function ValueDisplay({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="text-slate-400">—</span>;
  if (isObject(value)) return <NestedObject data={value} depth={0} />;
  if (isArray(value)) return <ArrayDisplay arr={value} />;
  return <span className="text-slate-700">{String(value)}</span>;
}

function NestedObject({ data, depth }: { data: Record<string, unknown>; depth: number }) {
  return (
    <div className={depth > 0 ? "border-l-2 border-slate-200 pl-2.5 space-y-1.5" : "space-y-1.5"}>
      {Object.entries(data).map(([key, value]) => (
        <Row key={key} k={key} v={value} />
      ))}
    </div>
  );
}

function ArrayDisplay({ arr }: { arr: unknown[] }) {
  const allObjects = arr.length > 0 && arr.every((item) => isObject(item));
  if (allObjects) {
    return (
      <div className="space-y-2">
        {arr.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white/60 p-2.5">
            <span className="inline-flex items-center justify-center size-4 rounded bg-slate-200 text-[10px] font-bold text-slate-500 mr-1.5 mb-1.5">{idx + 1}</span>
            <NestedObject data={item as Record<string, unknown>} depth={0} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <span className="text-slate-700">
      {arr.map((item, idx) => (
        <span key={idx}>
          {idx > 0 && <span className="text-slate-300">, </span>}
          {isObject(item) ? JSON.stringify(item) : String(item)}
        </span>
      ))}
    </span>
  );
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
          <Row key={key} k={key} v={value} />
        ))}
      </div>
    </div>
  );
}

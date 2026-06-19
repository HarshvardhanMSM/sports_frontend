"use client";

import React from "react";

const ACTION_STYLES: Record<string, string> = {
  CREATE:         "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  UPDATE:         "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DELETE:         "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  LOGIN:          "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  LOGOUT:         "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  APPROVE:        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  REJECT:         "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  ASSIGN:         "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  REMOVE:         "bg-pink-50 text-pink-700 ring-1 ring-pink-200",
  ORDER_CREATED:  "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  PRODUCT_UPDATED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  TICKET_CREATED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  USER_LOGIN:     "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
};

interface Props {
  action?: string;
}

export default function ActionBadge({ action = "UNKNOWN" }: Props) {
  const upper = action.toUpperCase();
  const cls = ACTION_STYLES[upper] ?? "bg-slate-50 text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {action}
    </span>
  );
}

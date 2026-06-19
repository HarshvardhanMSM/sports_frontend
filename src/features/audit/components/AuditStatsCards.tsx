"use client";

import React from "react";
import { FiList, FiClock, FiCalendar, FiAlertTriangle } from "react-icons/fi";

interface Props {
  totalLogs: number;
  todayCount: number;
  weekCount: number;
  criticalCount: number;
}

const CARDS: {
  label: string;
  subtitle: string;
  key: keyof Props;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}[] = [
  { label: "Total Logs",     subtitle: "All time entries",        key: "totalLogs",    icon: <FiList className="size-5" />,         iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  { label: "Today",          subtitle: "Actions logged today",     key: "todayCount",   icon: <FiClock className="size-5" />,        iconBg: "bg-blue-50",   iconColor: "text-blue-600" },
  { label: "This Week",      subtitle: "Last 7 days",             key: "weekCount",    icon: <FiCalendar className="size-5" />,     iconBg: "bg-emerald-50",iconColor: "text-emerald-600" },
  { label: "Critical Events", subtitle: "Requiring attention",    key: "criticalCount", icon: <FiAlertTriangle className="size-5" />, iconBg: "bg-rose-50",   iconColor: "text-rose-600" },
];

export default function AuditStatsCards(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((c) => (
        <div key={c.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
            <span className={c.iconColor}>{c.icon}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
            <p className="text-2xl font-bold text-slate-800">{props[c.key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

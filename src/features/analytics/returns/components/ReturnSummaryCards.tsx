"use client";

import React from "react";
import {
  FiRotateCcw,
  FiTrendingDown,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiRefreshCw,
} from "react-icons/fi";
import type { ReturnSummary } from "@/types/return-analytics.types";

interface Props {
  data: ReturnSummary | undefined;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalReturns",
    label: "Total Returns",
    icon: FiRotateCcw,
    bg: "from-indigo-500 to-indigo-600",
    sub: "All time returns",
    getValue: (d: ReturnSummary) => (d.totalReturns ?? 0).toLocaleString(),
  },
  {
    key: "returnRate",
    label: "Return Rate",
    icon: FiTrendingDown,
    bg: "from-amber-500 to-amber-600",
    sub: "Percentage of orders",
    getValue: (d: ReturnSummary) => `${Number(d.returnRate ?? 0).toFixed(1)}%`,
  },
  {
    key: "totalRefundAmount",
    label: "Total Refunded",
    icon: FiDollarSign,
    bg: "from-rose-500 to-rose-600",
    sub: "Total amount refunded",
    getValue: (d: ReturnSummary) => `$${(d.totalRefundAmount ?? 0).toLocaleString()}`,
  },
  {
    key: "pendingReturns",
    label: "Pending Returns",
    icon: FiClock,
    bg: "from-orange-500 to-orange-600",
    sub: "Awaiting decision",
    getValue: (d: ReturnSummary) => (d.pendingReturns ?? 0).toLocaleString(),
  },
  {
    key: "approvedReturns",
    label: "Approved Returns",
    icon: FiCheckCircle,
    bg: "from-emerald-500 to-emerald-600",
    sub: "Approved by staff",
    getValue: (d: ReturnSummary) => (d.approvedReturns ?? 0).toLocaleString(),
  },
  {
    key: "rejectedReturns",
    label: "Rejected Returns",
    icon: FiXCircle,
    bg: "from-red-500 to-red-600",
    sub: "Rejected by staff",
    getValue: (d: ReturnSummary) => (d.rejectedReturns ?? 0).toLocaleString(),
  },
  {
    key: "refundedReturns",
    label: "Refunded Returns",
    icon: FiRefreshCw,
    bg: "from-blue-500 to-blue-600",
    sub: "Successfully refunded",
    getValue: (d: ReturnSummary) => (d.refundedReturns ?? 0).toLocaleString(),
  },
  {
    key: "averageProcessingTimeHours",
    label: "Avg Processing",
    icon: FiBarChart2,
    bg: "from-cyan-500 to-cyan-600",
    sub: "Time to process return",
    getValue: (d: ReturnSummary) => `${Number(d.averageProcessingTimeHours ?? 0).toFixed(1)}h`,
  },
];

export default function ReturnSummaryCards({ data, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, sub, icon: Icon, bg, getValue }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
        >
          <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
          <div className="flex items-start justify-between mb-3">
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm`}>
              <Icon className="size-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-none">
            {isLoading ? "-" : data ? getValue(data) : "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}

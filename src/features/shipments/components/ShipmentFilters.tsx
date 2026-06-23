"use client";

import React from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
// import type { ShipmentStatus } from "@/types/shipment.types";

const STATUSES: { label: string; value: string }[] = [
  { label: "All Statuses", value: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Packed", value: "PACKED" },
  { label: "Ready For Dispatch", value: "READY_FOR_DISPATCH" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Failed Delivery", value: "FAILED_DELIVERY" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

export default function ShipmentFilters({
  search, onSearchChange, statusFilter, onStatusFilterChange, onRefresh, isRefetching,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search tracking or order number..."
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); }}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        onClick={onRefresh}
        disabled={isRefetching}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
      >
        <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
}

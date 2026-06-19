"use client";

import React, { useState } from "react";
import {
  FiActivity,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiDownload,
} from "react-icons/fi";

interface StockMovement {
  id: string;
  date: string;
  product: string;
  sku: string;
  type: string;
  quantity: number;
  reference: string;
  user: string;
}

const MOVEMENTS: StockMovement[] = [
  { id: "mv-1", date: "2026-06-15 09:23", product: "Nike Air Zoom Pegasus 40", sku: "NK-PEG40-001", type: "Stock In", quantity: 50, reference: "PO-2026-0045", user: "Admin" },
  { id: "mv-2", date: "2026-06-15 10:45", product: "Adidas Tiro Training Pants", sku: "AD-TR-PANTS-09", type: "Sale", quantity: -3, reference: "ORD-0892", user: "System" },
  { id: "mv-3", date: "2026-06-14 14:12", product: "Puma Future Ultimate FG", sku: "PM-FUT-ULT-02", type: "Return", quantity: 1, reference: "RET-0234", user: "System" },
  { id: "mv-4", date: "2026-06-14 11:30", product: "Under Armour Compression Tee", sku: "UA-COMP-01", type: "Stock In", quantity: 100, reference: "PO-2026-0044", user: "Admin" },
  { id: "mv-5", date: "2026-06-13 16:00", product: "Nike Elite Basketball Socks", sku: "NK-ELITE-SOCK-BK", type: "Adjustment", quantity: -5, reference: "ADJ-0021", user: "Warehouse Manager" },
  { id: "mv-6", date: "2026-06-13 09:15", product: "Adidas Ultraboost 22", sku: "AD-UB22-007", type: "Sale", quantity: -2, reference: "ORD-0891", user: "System" },
  { id: "mv-7", date: "2026-06-12 13:45", product: "Nike Dri-FIT Training Shorts", sku: "NK-DRFT-SH-03", type: "Stock In", quantity: 30, reference: "PO-2026-0043", user: "Admin" },
  { id: "mv-8", date: "2026-06-12 10:00", product: "Puma Gym Bag Pro", sku: "PM-GYMBAG-001", type: "Damage Write-off", quantity: -2, reference: "WO-0012", user: "Warehouse Manager" },
  { id: "mv-9", date: "2026-06-11 15:20", product: "Under Armour Running Cap", sku: "UA-CAP-RUN-02", type: "Sale", quantity: -4, reference: "ORD-0888", user: "System" },
  { id: "mv-10", date: "2026-06-10 11:00", product: "Nike Zoom Fly 5", sku: "NK-ZF5-010", type: "Stock In", quantity: 40, reference: "PO-2026-0042", user: "Admin" },
];

const TYPE_BADGE: Record<string, string> = {
  "Stock In": "bg-emerald-50 text-emerald-700",
  "Sale": "bg-blue-50 text-blue-700",
  "Return": "bg-purple-50 text-purple-700",
  "Adjustment": "bg-amber-50 text-amber-700",
  "Damage Write-off": "bg-red-50 text-red-700",
};

function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_BADGE[type] ?? "bg-slate-100 text-slate-600";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{type}</span>;
}

export default function StockMovementsPage() {
  const [filter, setFilter] = useState("All");

  const filtered = MOVEMENTS.filter((m) => filter === "All" || m.type === filter);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Stock Movements</h1>
          <p className="text-sm text-slate-500">Track all incoming and outgoing stock movements and adjustments.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white shadow-sm hover:bg-slate-50 transition-colors">
          <FiDownload className="size-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiActivity className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today&apos;s Movements</p>
            <p className="text-2xl font-bold text-slate-800">23</p>
            <p className="text-xs text-slate-500 mt-0.5">as of today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiArrowUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock In</p>
            <p className="text-2xl font-bold text-slate-800">+145</p>
            <p className="text-xs text-slate-500 mt-0.5">units received</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiArrowDown className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock Out</p>
            <p className="text-2xl font-bold text-slate-800">-88</p>
            <p className="text-xs text-slate-500 mt-0.5">units dispatched</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiTrendingUp className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Change</p>
            <p className="text-2xl font-bold text-slate-800">+57</p>
            <p className="text-xs text-slate-500 mt-0.5">net unit change</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-600 shrink-0">Filter by Type:</p>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Types</option>
          <option value="Stock In">Stock In</option>
          <option value="Sale">Sale</option>
          <option value="Return">Return</option>
          <option value="Adjustment">Adjustment</option>
          <option value="Damage Write-off">Damage Write-off</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date / Time</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product / SKU</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No movements found.</td>
              </tr>
            ) : (
              filtered.map((mv) => (
                <tr key={mv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap font-mono">{mv.date}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{mv.product}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{mv.sku}</p>
                  </td>
                  <td className="px-4 py-4"><TypeBadge type={mv.type} /></td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-bold ${mv.quantity > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {mv.quantity > 0 ? `+${mv.quantity}` : mv.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 font-mono">{mv.reference}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{mv.user}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  FiBell,
  FiAlertOctagon,
  FiAlertTriangle,
  FiSearch,
  FiRefreshCw,
  FiBellOff,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface InventoryAlert {
  id: string;
  product: string;
  sku: string;
  alertType: string;
  currentStock: number;
  threshold: number;
  priority: string;
  date: string;
}

const ALERTS: InventoryAlert[] = [
  { id: "alt-1", product: "Nike Elite Basketball Socks", sku: "NK-ELITE-SOCK-BK", alertType: "Out of Stock", currentStock: 0, threshold: 5, priority: "Critical", date: "2026-06-11" },
  { id: "alt-2", product: "Under Armour Running Cap", sku: "UA-CAP-RUN-02", alertType: "Out of Stock", currentStock: 0, threshold: 8, priority: "Critical", date: "2026-06-07" },
  { id: "alt-3", product: "Puma Future Ultimate FG", sku: "PM-FUT-ULT-02", alertType: "Low Stock", currentStock: 8, threshold: 10, priority: "Warning", date: "2026-06-13" },
  { id: "alt-4", product: "Adidas Ultraboost 22", sku: "AD-UB22-007", alertType: "Low Stock", currentStock: 6, threshold: 10, priority: "Warning", date: "2026-06-10" },
  { id: "alt-5", product: "Puma Gym Bag Pro", sku: "PM-GYMBAG-001", alertType: "Low Stock", currentStock: 3, threshold: 5, priority: "Warning", date: "2026-06-08" },
  { id: "alt-6", product: "Nike React Infinity Run 3", sku: "NK-RIR3-005", alertType: "Out of Stock", currentStock: 0, threshold: 10, priority: "Critical", date: "2026-06-06" },
  { id: "alt-7", product: "Adidas Response Run Shoes", sku: "AD-RSP-RUN-04", alertType: "Low Stock", currentStock: 4, threshold: 10, priority: "Warning", date: "2026-06-05" },
  { id: "alt-8", product: "Under Armour HOVR Sonic 5", sku: "UA-HOVR-S5-03", alertType: "Low Stock", currentStock: 7, threshold: 10, priority: "Warning", date: "2026-06-04" },
  { id: "alt-9", product: "Puma Softride Premier Slip-On", sku: "PM-SRPO-002", alertType: "Out of Stock", currentStock: 0, threshold: 5, priority: "Critical", date: "2026-06-03" },
  { id: "alt-10", product: "Nike Flex Runner 2", sku: "NK-FLX2-009", alertType: "Low Stock", currentStock: 2, threshold: 5, priority: "Warning", date: "2026-06-02" },
];

const PAGE_SIZE = 5;

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "Critical") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">{priority}</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">{priority}</span>;
}

export default function InventoryAlertsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = ALERTS.filter((a) => {
    const matchSearch =
      a.product.toLowerCase().includes(search.toLowerCase()) ||
      a.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || a.priority === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inventory Alerts</h1>
          <p className="text-sm text-slate-500">Stay ahead of stock issues with real-time low stock and out-of-stock alerts.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiBell className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Alerts</p>
            <p className="text-2xl font-bold text-slate-800">13</p>
            <p className="text-xs text-slate-500 mt-0.5">requiring action</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiAlertOctagon className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical (Out of Stock)</p>
            <p className="text-2xl font-bold text-slate-800">5</p>
            <p className="text-xs text-slate-500 mt-0.5">zero stock items</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiAlertTriangle className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Warning (Low Stock)</p>
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-xs text-slate-500 mt-0.5">below threshold</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by product or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="Warning">Warning</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product / SKU</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Stock</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Threshold</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No alerts found.</td>
              </tr>
            ) : (
              paginated.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{alert.product}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{alert.sku}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{alert.alertType}</td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-bold ${alert.currentStock === 0 ? "text-red-600" : "text-slate-800"}`}>
                      {alert.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{alert.threshold}</td>
                  <td className="px-4 py-4"><PriorityBadge priority={alert.priority} /></td>
                  <td className="px-4 py-4 text-sm text-slate-700">{alert.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Restock">
                        <FiRefreshCw className="size-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Dismiss">
                        <FiBellOff className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}

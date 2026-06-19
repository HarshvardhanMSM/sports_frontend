"use client";

import React, { useState } from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiXCircle,
  FiDollarSign,
  FiSearch,
  FiEdit2,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface InventoryItem {
  id: string;
  product: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  status: string;
  lastUpdated: string;
}

const INVENTORY: InventoryItem[] = [
  { id: "inv-1", product: "Nike Air Zoom Pegasus 40", sku: "NK-PEG40-001", category: "Footwear", stock: 45, threshold: 10, status: "In Stock", lastUpdated: "2026-06-15" },
  { id: "inv-2", product: "Adidas Tiro Training Pants", sku: "AD-TR-PANTS-09", category: "Apparel", stock: 120, threshold: 15, status: "In Stock", lastUpdated: "2026-06-14" },
  { id: "inv-3", product: "Puma Future Ultimate FG", sku: "PM-FUT-ULT-02", category: "Footwear", stock: 8, threshold: 10, status: "Low Stock", lastUpdated: "2026-06-13" },
  { id: "inv-4", product: "Under Armour Compression Tee", sku: "UA-COMP-01", category: "Apparel", stock: 200, threshold: 20, status: "In Stock", lastUpdated: "2026-06-12" },
  { id: "inv-5", product: "Nike Elite Basketball Socks", sku: "NK-ELITE-SOCK-BK", category: "Accessories", stock: 0, threshold: 5, status: "Out of Stock", lastUpdated: "2026-06-11" },
  { id: "inv-6", product: "Adidas Ultraboost 22", sku: "AD-UB22-007", category: "Footwear", stock: 6, threshold: 10, status: "Low Stock", lastUpdated: "2026-06-10" },
  { id: "inv-7", product: "Nike Dri-FIT Training Shorts", sku: "NK-DRFT-SH-03", category: "Apparel", stock: 78, threshold: 15, status: "In Stock", lastUpdated: "2026-06-09" },
  { id: "inv-8", product: "Puma Gym Bag Pro", sku: "PM-GYMBAG-001", category: "Accessories", stock: 3, threshold: 5, status: "Low Stock", lastUpdated: "2026-06-08" },
  { id: "inv-9", product: "Under Armour Running Cap", sku: "UA-CAP-RUN-02", category: "Accessories", stock: 0, threshold: 8, status: "Out of Stock", lastUpdated: "2026-06-07" },
  { id: "inv-10", product: "Nike Zoom Fly 5", sku: "NK-ZF5-010", category: "Footwear", stock: 34, threshold: 10, status: "In Stock", lastUpdated: "2026-06-06" },
];

const PAGE_SIZE = 5;

const STATUS_CONFIG: Record<string, { cls: string; dot: string; bar: string }> = {
  "In Stock": { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  "Low Stock": { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500", bar: "bg-amber-500" },
  "Out of Stock": { cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500", bar: "bg-rose-500" },
};

const CATEGORY_CONFIG: Record<string, string> = {
  Footwear: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  Apparel: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  Accessories: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

function StockBar({ stock, threshold }: { stock: number; threshold: number }) {
  const pct = threshold > 0 ? Math.min((stock / (threshold * 3)) * 100, 100) : 0;
  const color =
    stock === 0 ? "bg-rose-500" : stock < threshold ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-8 text-right">{stock}</span>
    </div>
  );
}

const STAT_CARDS = [
  { label: "Total SKUs", value: "156", sub: "Active product variants", icon: FiPackage, bg: "from-indigo-500 to-indigo-600" },
  { label: "Low Stock", value: "8", sub: "Below threshold", icon: FiAlertTriangle, bg: "from-amber-500 to-amber-600" },
  { label: "Out of Stock", value: "5", sub: "Needs restocking", icon: FiXCircle, bg: "from-rose-500 to-rose-600" },
  { label: "Total Value", value: "$45,230", sub: "Estimated stock value", icon: FiDollarSign, bg: "from-emerald-500 to-emerald-600" },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = INVENTORY.filter((item) => {
    const matchSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || item.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Stock Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitor and manage stock levels across all products and SKUs.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by product or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="size-4 text-slate-400 shrink-0" />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-white transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product / SKU</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Threshold</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FiPackage className="size-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No inventory items found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["In Stock"];
                  const categoryCls = CATEGORY_CONFIG[item.category] ?? "bg-slate-100 text-slate-600";
                  return (
                    <tr key={item.id} className="group hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">{item.product}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${categoryCls}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StockBar stock={item.stock} threshold={item.threshold} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                          {item.threshold}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
                          <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{item.lastUpdated}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Edit">
                            <FiEdit2 className="size-4" />
                          </button>
                          <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Restock">
                            <FiRefreshCw className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  FiShoppingBag,
  FiTrendingUp,
  FiBox,
  FiDollarSign,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";
import { useReportProducts, useReportInventory } from "@/hooks/useReports";
import { resolveImageUrl } from "@/lib/image";
import Select from "@/components/ui/select/Select";

const PRESETS = [

  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "Last 90 Days", value: "last90" },
  { label: "This Month", value: "thisMonth" },
  { label: "This Year", value: "thisYear" },
];

function dateParams(preset: string) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${d}`;
  let from = today;
  switch (preset) {
    case "today":    from = today; break;
    case "last7":    from = new Date(now.getTime() - 7 * 864e5).toISOString().slice(0, 10); break;
    case "last30":   from = new Date(now.getTime() - 30 * 864e5).toISOString().slice(0, 10); break;
    case "last90":   from = new Date(now.getTime() - 90 * 864e5).toISOString().slice(0, 10); break;
    case "thisMonth":from = `${y}-${m}-01`; break;
    case "thisYear": from = `${y}-01-01`; break;
    default:         from = new Date(now.getTime() - 30 * 864e5).toISOString().slice(0, 10);
  }
  return { dateFrom: from, dateTo: today };
}

export default function ProductPerformancePage() {
  const [preset, setPreset] = useState("last30");
  const [search, setSearch] = useState("");
  const params = useMemo(() => dateParams(preset), [preset]);

  const { data: products, isLoading: prodLoading, error: prodError, refetch: refetchProd } = useReportProducts(params);
  const { data: inventory, isLoading: invLoading, error: invError, refetch: refetchInv } = useReportInventory(params);

  const isLoading = prodLoading || invLoading;
  const hasError = prodError || invError;

  const handleRefresh = useCallback(() => {
    refetchProd();
    refetchInv();
  }, [refetchProd, refetchInv]);

  const allProducts = products ?? [];
  const filtered = allProducts.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  const topEarner = allProducts.reduce((best, p) => (p.totalRevenue > (best?.totalRevenue ?? 0) ? p : best), allProducts[0]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Performance</h1>
          <p className="text-sm text-slate-500">Analyze product-level sales metrics and inventory health.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={preset}
            onChange={setPreset}
            options={PRESETS}
            Icon={FiCalendar}
            className="min-w-[150px]"
          />
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <FiRefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <FiDownload className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load product data. Please try again.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
              <div className="h-12 w-12 bg-slate-200 rounded-xl mb-3" />
              <div className="h-5 w-20 bg-slate-200 rounded mb-1" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard icon={<FiShoppingBag className="size-6 text-indigo-600" />} bg="bg-indigo-50" label="Total Products" value={inventory?.totalInventoryItems?.toLocaleString() ?? "30"} sub="Active in catalog" />
            <StatCard icon={<FiBox className="size-6 text-emerald-600" />} bg="bg-emerald-50" label="Products Sold" value={allProducts.length.toString()} sub="With orders this period" />
            <StatCard icon={<FiTrendingUp className="size-6 text-amber-600" />} bg="bg-amber-50" label="Top Earner" value={topEarner ? `$${topEarner.totalRevenue.toLocaleString()}` : "$0"} sub={topEarner?.productName ?? "—"} />
            <StatCard icon={<FiDollarSign className="size-6 text-blue-600" />} bg="bg-blue-50" label="Stock Value" value={`$${(inventory?.totalStockValue ?? 0).toLocaleString()}`} sub="Total inventory value" />
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <p className="text-xs text-slate-500 ml-auto">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {allProducts.length} products
        </p>
      </div>

      {/* Product Performance Table */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Product Performance Overview</h2>
        {prodLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FiBarChart2 className="size-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No product performance data available for this period</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.productId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {row.imageUrl && (
                            <img src={resolveImageUrl(row.imageUrl)} alt="" className="size-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                          )}
                          <span className="text-sm font-semibold text-slate-700">{row.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{row.totalSold}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">${(row.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                          {row.orderCount}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Alerts */}
      {inventory && inventory.lowStock && inventory.lowStock.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Low Stock Alerts</h2>
              <p className="text-xs text-slate-500 mt-0.5">{inventory.lowStockItems} items below threshold</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.lowStock.map((item) => (
                  <tr key={item.inventoryId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img src={resolveImageUrl(item.imageUrl)} alt="" className="size-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-slate-700">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-lg text-xs font-bold ${item.currentStock === 0 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{item.threshold}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">${parseFloat(item.unitCost).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-4">
                      {item.currentStock === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">Out of Stock</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Low Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub }: { icon: React.ReactNode; bg: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiRotateCcw,
  FiDownload,
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiBarChart2,
} from "react-icons/fi";
import { useReportSales, useReportReturns } from "@/hooks/useReports";

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

function fmtCurrency(val: number) {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SalesReportsPage() {
  const [preset, setPreset] = useState("last30");
  const params = useMemo(() => dateParams(preset), [preset]);

  const { data: sales, isLoading: salesLoading, error: salesError, refetch: refetchSales } = useReportSales(params);
  const { data: returns, isLoading: retLoading, error: retError, refetch: refetchRet } = useReportReturns(params);

  const isLoading = salesLoading || retLoading;
  const hasError = salesError || retError;

  const handleRefresh = useCallback(() => {
    refetchSales();
    refetchRet();
  }, [refetchSales, refetchRet]);

  const dailySales = sales ?? [];
  const totalRevenue = dailySales.reduce((s, r) => s + (r.totalRevenue ?? 0), 0);
  const totalOrders = dailySales.reduce((s, r) => s + (r.totalOrders ?? 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const returnsData = returns;
  const returnRate = returnsData?.returnRate ?? 0;
  const byReason = returnsData?.byReason ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Daily sales performance and return analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <FiCalendar className="size-4 text-slate-400 shrink-0" />
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="text-sm font-medium text-slate-700 outline-none bg-transparent"
            >
              {PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiDownload className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load sales data. Please try again.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 animate-pulse">
              <div className="size-10 bg-slate-200 rounded-xl mb-3" />
              <div className="h-7 w-24 bg-slate-200 rounded mb-1" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Revenue" value={`$${fmtCurrency(totalRevenue)}`} sub="Gross revenue" icon={FiDollarSign} bg="from-indigo-500 to-indigo-600" />
            <StatCard label="Total Orders" value={totalOrders.toLocaleString()} sub="Across all channels" icon={FiShoppingBag} bg="from-emerald-500 to-emerald-600" />
            <StatCard label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} sub="Per completed order" icon={FiTrendingUp} bg="from-blue-500 to-blue-600" />
            <StatCard label="Return Rate" value={`${returnRate.toFixed(1)}%`} sub={`${returnsData?.totalReturns ?? 0} total returns`} icon={FiRotateCcw} bg="from-rose-500 to-rose-600" />
          </>
        )}
      </div>

      {/* Daily Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">Daily Sales Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Day-by-day breakdown of orders, revenue, and average order value.</p>
        </div>
        {salesLoading ? (
          <div className="p-6 animate-pulse space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
          </div>
        ) : dailySales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiBarChart2 className="size-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-500">No sales data available for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailySales.map((row, i) => (
                  <tr key={row.date ?? i} className="group hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{fmtDate(row.date)}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center justify-center min-w-[36px] h-7 px-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {row.totalOrders}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">${fmtCurrency(row.totalRevenue ?? 0)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">${(row.averageOrderValue ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Returns Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">Returns Analysis</h2>
          <p className="text-xs text-slate-500 mt-0.5">Return metrics and breakdown by reason.</p>
        </div>
        {retLoading ? (
          <div className="p-6 animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
          </div>
        ) : !returnsData ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiRotateCcw className="size-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-500">No returns data available</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Count</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Refunded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byReason.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">No return reasons recorded</td>
                    </tr>
                  ) : (
                    byReason.map((r) => (
                      <tr key={r.reason} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                            {r.reason.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700">{r.count}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">${(r.totalRefunded ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Returns</p>
                <p className="text-2xl font-bold text-slate-800">{returnsData.totalReturns}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{returnsData.completedReturns}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{returnsData.pendingReturns}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Refunded</p>
                <p className="text-2xl font-bold text-rose-600">${(returnsData.totalRefunded ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, bg }: { label: string; value: string; sub: string; icon: React.ComponentType<{ className?: string }>; bg: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
      <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiDollarSign,
  FiDownload,
  FiRefreshCw,
  FiAlertCircle,
  FiBarChart2,
  FiAward,
} from "react-icons/fi";
import { useReportCustomers } from "@/hooks/useReports";

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

const SPENDER_COLORS = ["from-amber-400 to-yellow-500", "from-slate-400 to-slate-500", "from-orange-400 to-amber-500"];

export default function CustomerAnalyticsPage() {
  const [preset, setPreset] = useState("last30");
  const params = useMemo(() => dateParams(preset), [preset]);

  const { data: customers, isLoading, error, refetch } = useReportCustomers(params);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const topSpenders = customers?.topSpenders ?? [];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Analytics</h1>
          <p className="text-sm text-slate-500">Track customer acquisition, retention, and top spenders.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            {PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
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
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load customer analytics. Please try again.</p>
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
            <StatCard icon={<FiUsers className="size-6 text-indigo-600" />} bg="bg-indigo-50" label="Total Customers" value={(customers?.totalCustomers ?? 0).toLocaleString()} sub="All registered customers" />
            <StatCard icon={<FiUserPlus className="size-6 text-emerald-600" />} bg="bg-emerald-50" label="New Customers" value={(customers?.newCustomers ?? 0).toLocaleString()} sub="New this period" />
            <StatCard icon={<FiUserCheck className="size-6 text-blue-600" />} bg="bg-blue-50" label="Repeat Customers" value={(customers?.repeatCustomers ?? 0).toLocaleString()} sub="Returning customers" />
            <StatCard icon={<FiAward className="size-6 text-purple-600" />} bg="bg-purple-50" label="Top Spenders" value={topSpenders.length.toString()} sub="Highest value customers" />
          </>
        )}
      </div>

      {/* Top Spenders */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Top Spenders</h2>
        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
          </div>
        ) : topSpenders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FiBarChart2 className="size-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No customer spending data available</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSpenders.map((row, idx) => (
                  <tr key={row.customerId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4">
                      <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${SPENDER_COLORS[idx] ?? "from-slate-200 to-slate-300"} text-xs font-bold text-white shadow-sm`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-700">{row.customerName}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                        {row.orderCount}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-800">${(row.totalSpent ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

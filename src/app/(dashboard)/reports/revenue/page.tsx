"use client";

import React, { useState } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiRotateCcw,
  FiPieChart,
  FiDownload,
  FiCalendar,
} from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface RevenueByCategory {
  category: string;
  revenue: number;
  orders: number;
  units: number;
  avgOrderValue: number;
  margin: string;
  growth: string;
}

interface PaymentMethod {
  method: string;
  revenue: number;
  percentage: number;
  icon: string;
}

const revenueByCategory: RevenueByCategory[] = [
  { category: "Footwear", revenue: 82340.00, orders: 445, units: 578, avgOrderValue: 185.03, margin: "48.2%", growth: "+22.4%" },
  { category: "Apparel", revenue: 45670.00, orders: 534, units: 1234, avgOrderValue: 85.52, margin: "38.5%", growth: "+14.8%" },
  { category: "Accessories", revenue: 12340.00, orders: 178, units: 890, avgOrderValue: 69.33, margin: "35.2%", growth: "+8.3%" },
  { category: "Equipment", revenue: 5330.00, orders: 93, units: 98, avgOrderValue: 57.31, margin: "31.4%", growth: "+3.1%" },
];

const paymentMethods: PaymentMethod[] = [
  { method: "Credit Card", revenue: 89340, percentage: 61.4, icon: "💳" },
  { method: "PayPal", revenue: 31230, percentage: 21.5, icon: "🅿️" },
  { method: "Cash on Delivery", revenue: 18900, percentage: 13.0, icon: "💵" },
  { method: "Bank Transfer", revenue: 6210, percentage: 4.1, icon: "🏦" },
];

const dateRangeOptions = [
  { value: "Last 7 Days", label: "Last 7 Days" },
  { value: "Last 30 Days", label: "Last 30 Days" },
  { value: "Last 3 Months", label: "Last 3 Months" },
  { value: "This Year", label: "This Year" },
];

export default function RevenueAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Revenue Analytics</h1>
          <p className="text-sm text-slate-500">Deep-dive into revenue streams, margins, and growth trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
            Icon={FiCalendar}
            className="min-w-[150px]"
          />

          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            <FiDownload className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiDollarSign className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Revenue</p>
            <p className="text-2xl font-bold text-slate-800">$167,450</p>
            <p className="text-xs text-slate-500 mt-0.5">Before deductions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiTrendingUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Revenue</p>
            <p className="text-2xl font-bold text-slate-800">$145,680</p>
            <p className="text-xs text-slate-500 mt-0.5">After refunds & fees</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiRotateCcw className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Refunds</p>
            <p className="text-2xl font-bold text-slate-800">$21,770</p>
            <p className="text-xs text-slate-500 mt-0.5">Returned & refunded</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiPieChart className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Margin</p>
            <p className="text-2xl font-bold text-slate-800">42.3%</p>
            <p className="text-xs text-slate-500 mt-0.5">Blended margin rate</p>
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Revenue by Category</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue ($)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Units</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order Value ($)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Margin %</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Growth %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {revenueByCategory.map((row) => (
                <tr key={row.category} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">{row.category}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">${row.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.orders}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.units.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">${row.avgOrderValue.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.margin}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-600">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Payment Method */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Revenue by Payment Method</h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {paymentMethods.map((pm) => (
            <div key={pm.method} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{pm.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{pm.method}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-0.5">
                ${pm.revenue.toLocaleString("en-US")}
              </p>
              <p className="text-xs text-slate-500 mb-3">{pm.percentage}% of total revenue</p>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${pm.percentage}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-1.5 text-right">{pm.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

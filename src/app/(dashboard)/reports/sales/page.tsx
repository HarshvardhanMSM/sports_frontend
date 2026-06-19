"use client";

import React, { useState } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiBarChart2,
  FiDownload,
  FiCalendar,
} from "react-icons/fi";

interface MonthlySale {
  month: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
  returns: number;
  netRevenue: number;
}

interface TopProduct {
  rank: number;
  product: string;
  category: string;
  unitsSold: number;
  revenue: number;
  percentOfTotal: string;
  percentNum: number;
}

const monthlySales: MonthlySale[] = [
  { month: "January 2026", orders: 89, revenue: 10234.56, avgOrderValue: 114.99, returns: 4, netRevenue: 9754.56 },
  { month: "February 2026", orders: 102, revenue: 11890.20, avgOrderValue: 116.57, returns: 6, netRevenue: 11170.20 },
  { month: "March 2026", orders: 118, revenue: 13456.78, avgOrderValue: 114.04, returns: 5, netRevenue: 12956.78 },
  { month: "April 2026", orders: 134, revenue: 15678.90, avgOrderValue: 117.01, returns: 8, netRevenue: 14878.90 },
  { month: "May 2026", orders: 156, revenue: 18234.56, avgOrderValue: 116.89, returns: 9, netRevenue: 17334.56 },
  { month: "June 2026 (MTD)", orders: 98, revenue: 11450.00, avgOrderValue: 116.84, returns: 3, netRevenue: 11050.00 },
];

const topProducts: TopProduct[] = [
  { rank: 1, product: "Nike Air Zoom Pegasus 40", category: "Footwear", unitsSold: 234, revenue: 27060.00, percentOfTotal: "18.6%", percentNum: 18.6 },
  { rank: 2, product: "Adidas Tiro Training Pants", category: "Apparel", unitsSold: 456, revenue: 20520.00, percentOfTotal: "14.1%", percentNum: 14.1 },
  { rank: 3, product: "Puma Future Ultimate FG", category: "Footwear", unitsSold: 89, revenue: 17380.00, percentOfTotal: "11.9%", percentNum: 11.9 },
  { rank: 4, product: "Under Armour Compression Tee", category: "Apparel", unitsSold: 312, revenue: 10920.00, percentOfTotal: "7.5%", percentNum: 7.5 },
  { rank: 5, product: "Nike Elite Basketball Socks", category: "Accessories", unitsSold: 890, revenue: 12460.00, percentOfTotal: "8.6%", percentNum: 8.6 },
];

const CATEGORY_CONFIG: Record<string, string> = {
  Footwear: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  Apparel: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  Accessories: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const RANK_COLORS = [
  "from-amber-400 to-yellow-500",
  "from-slate-400 to-slate-500",
  "from-orange-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-slate-200 to-slate-300",
];

const STAT_CARDS = [
  { label: "Total Revenue", value: "$145,680", sub: "All time gross revenue", icon: FiDollarSign, bg: "from-indigo-500 to-indigo-600" },
  { label: "Total Orders", value: "1,250", sub: "Across all channels", icon: FiShoppingBag, bg: "from-emerald-500 to-emerald-600" },
  { label: "Avg Order Value", value: "$116.54", sub: "Per completed order", icon: FiTrendingUp, bg: "from-blue-500 to-blue-600" },
  { label: "Revenue Growth", value: "+18.6%", sub: "Compared to last period", icon: FiBarChart2, bg: "from-violet-500 to-violet-600" },
];

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

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
          <p className="text-sm text-slate-500 mt-0.5">Comprehensive sales performance overview across all channels and time periods.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <FiCalendar className="size-4 text-slate-400 shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm font-medium text-slate-700 outline-none bg-transparent"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiDownload className="size-4" />
            Export Report
          </button>
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

      {/* Monthly Sales Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">Monthly Sales Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Month-by-month breakdown of orders, revenue, and net performance.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Order</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Returns</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlySales.map((row, i) => (
                <tr key={row.month} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {row.month}
                    {i === monthlySales.length - 1 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center min-w-[36px] h-7 px-2 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {row.orders}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">${row.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">${row.avgOrderValue.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-lg text-xs font-bold ${row.returns > 5 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>
                      {row.returns}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-indigo-600">${row.netRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-800">Top Selling Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">Best performing products ranked by revenue contribution.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12">Rank</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px]">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((row) => (
                <tr key={row.rank} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${RANK_COLORS[row.rank - 1]} text-xs font-bold text-white shadow-sm`}>
                      {row.rank}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{row.product}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_CONFIG[row.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">{row.unitsSold.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">${row.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 max-w-[100px]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                          style={{ width: `${(row.percentNum / 20) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-10">{row.percentOfTotal}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

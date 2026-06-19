"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiActivity,
  FiDownload,
} from "react-icons/fi";

interface AcquisitionChannel {
  channel: string;
  customers: number;
  percentage: number;
  color: string;
}

interface CustomerSegment {
  segment: string;
  count: number;
  avgLtv: number;
  avgOrders: number;
  retention: string;
  churn: string;
}

interface MonthlyGrowth {
  month: string;
  newCustomers: number;
  returningCustomers: number;
  totalOrders: number;
  revenue: number;
}

const acquisitionChannels: AcquisitionChannel[] = [
  { channel: "Organic Search", customers: 1456, percentage: 37.9, color: "indigo" },
  { channel: "Social Media", customers: 892, percentage: 23.2, color: "blue" },
  { channel: "Direct", customers: 678, percentage: 17.6, color: "emerald" },
  { channel: "Email", customers: 456, percentage: 11.9, color: "amber" },
  { channel: "Paid Ads", customers: 360, percentage: 9.4, color: "purple" },
];

const customerSegments: CustomerSegment[] = [
  { segment: "High Value (LTV > $500)", count: 245, avgLtv: 1234.56, avgOrders: 8.9, retention: "94.3%", churn: "5.7%" },
  { segment: "Mid Value ($200–$500)", count: 678, avgLtv: 312.45, avgOrders: 4.2, retention: "78.2%", churn: "21.8%" },
  { segment: "Low Value (< $200)", count: 2919, avgLtv: 89.34, avgOrders: 1.8, retention: "62.4%", churn: "37.6%" },
];

const monthlyGrowth: MonthlyGrowth[] = [
  { month: "Jan 2026", newCustomers: 89, returningCustomers: 234, totalOrders: 323, revenue: 34560 },
  { month: "Feb 2026", newCustomers: 102, returningCustomers: 267, totalOrders: 369, revenue: 39870 },
  { month: "Mar 2026", newCustomers: 118, returningCustomers: 298, totalOrders: 416, revenue: 45230 },
  { month: "Apr 2026", newCustomers: 134, returningCustomers: 312, totalOrders: 446, revenue: 51340 },
  { month: "May 2026", newCustomers: 156, returningCustomers: 345, totalOrders: 501, revenue: 58920 },
  { month: "Jun 2026 (MTD)", newCustomers: 78, returningCustomers: 189, totalOrders: 267, revenue: 31450 },
];

const progressBarColors: Record<string, string> = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  purple: "bg-purple-500",
};

const textColors: Record<string, string> = {
  indigo: "text-indigo-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  purple: "text-purple-600",
};

export default function CustomerAnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Analytics</h1>
          <p className="text-sm text-slate-500">Understand customer behavior, lifetime value, and acquisition channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
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
            <FiUsers className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800">3,842</p>
            <p className="text-xs text-slate-500 mt-0.5">All registered customers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiUserPlus className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">New This Month</p>
            <p className="text-2xl font-bold text-slate-800">156</p>
            <p className="text-xs text-slate-500 mt-0.5">June 2026 signups</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiDollarSign className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Lifetime Value</p>
            <p className="text-2xl font-bold text-slate-800">$312.40</p>
            <p className="text-xs text-slate-500 mt-0.5">Per customer LTV</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiActivity className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Retention Rate</p>
            <p className="text-2xl font-bold text-slate-800">76.8%</p>
            <p className="text-xs text-slate-500 mt-0.5">12-month retention</p>
          </div>
        </div>
      </div>

      {/* Customer Acquisition by Channel */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Customer Acquisition by Channel</h2>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {acquisitionChannels.map((ch) => (
            <div key={ch.channel} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-600 mb-2">{ch.channel}</p>
              <p className={`text-2xl font-bold ${textColors[ch.color]} mb-0.5`}>
                {ch.customers.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mb-3">{ch.percentage}% of total</p>
              <div className="h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className={`h-1.5 rounded-full ${progressBarColors[ch.color]}`}
                  style={{ width: `${ch.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Customer Segments</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Segment</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Count</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg LTV ($)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Orders</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Retention Rate</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Churn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customerSegments.map((seg) => (
                <tr key={seg.segment} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">{seg.segment}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{seg.count.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">${seg.avgLtv.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{seg.avgOrders}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {seg.retention}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                      {seg.churn}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Customer Growth */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">New Customer Growth</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">New Customers</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Returning Customers</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyGrowth.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">{row.month}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.newCustomers}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.returningCustomers}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{row.totalOrders}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">${row.revenue.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

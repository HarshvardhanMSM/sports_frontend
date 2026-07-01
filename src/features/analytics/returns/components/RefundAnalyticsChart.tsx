"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FiDollarSign } from "react-icons/fi";
import type { RefundAnalytics, ReturnSummary } from "@/types/return-analytics.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: RefundAnalytics | undefined;
  summary: ReturnSummary | undefined;
  isLoading: boolean;
}

export default function RefundAnalyticsChart({ data, summary, isLoading }: Props) {
  const trend = data?.monthlyRefunds ?? [];
  const totalMonths = trend.length;

  const totalRefunds = summary?.totalReturns ?? (totalMonths > 0 ? trend.reduce((s, m) => s + Number(m.count ?? 0), 0) : 0);
  const refundedAmount = summary?.totalRefundAmount ?? (totalMonths > 0 ? trend.reduce((s, m) => s + Number(m.total ?? 0), 0) : 0);

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
                <div className="size-10 bg-slate-200 rounded-xl mb-3" />
                <div className="h-7 w-20 bg-slate-200 rounded mb-1" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
              </div>
            ))
          : [
              { label: "Total Refunds", value: totalRefunds.toLocaleString(), bg: "from-indigo-500 to-indigo-600" },
              { label: "Refunded Amount", value: `$${refundedAmount.toLocaleString()}`, bg: "from-rose-500 to-rose-600" },
              { label: "Months Active", value: `${totalMonths}`, bg: "from-emerald-500 to-emerald-600" },
              { label: "Avg Monthly Refunds", value: totalMonths > 0 ? (totalRefunds / totalMonths).toFixed(1) : "0", bg: "from-cyan-500 to-cyan-600" },
            ].map(({ label, value, bg }) => (
              <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
                <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
                <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
                  <FiDollarSign className="size-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
      </div>

      {/* Monthly refund trend chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Monthly Refund Trend</h2>
          <p className="text-xs text-slate-500 mt-0.5">Refund amount and volume over time</p>
        </div>
        {isLoading ? (
          <div className="p-6 animate-pulse">
            <div className="h-64 bg-slate-200 rounded" />
          </div>
        ) : trend.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm font-semibold text-slate-500">No refund trend data available</p>
          </div>
        ) : (
          <div className="p-6">
            <ReactApexChart
              options={{
                chart: { type: "bar", fontFamily: "Outfit, sans-serif", toolbar: { show: false } },
                colors: ["#6366f1", "#f59e0b"],
                xaxis: {
                  categories: trend.map((m) => m.month ?? ""),
                  labels: { style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" } },
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                },
                yaxis: {
                  labels: {
                    style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" },
                    formatter: (val: number) => `$${val}`,
                  },
                },
                grid: { borderColor: "#f1f5f9", strokeDashArray: 0 },
                legend: { position: "top", fontFamily: "Outfit, sans-serif" },
                tooltip: { y: { formatter: (val: number) => `$${val.toFixed(2)}` } },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: "60%" },
                },
                dataLabels: { enabled: false },
              }}
              series={[
                { name: "Amount", data: trend.map((m) => Number(m.total ?? 0)) },
                { name: "Count", data: trend.map((m) => Number(m.count ?? 0)) },
              ]}
              type="bar"
              height={280}
            />
          </div>
        )}
      </div>
    </div>
  );
}

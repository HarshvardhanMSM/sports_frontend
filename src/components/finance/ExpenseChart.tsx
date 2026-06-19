"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type { ExpenseItem } from "@/types/financial-report.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: ExpenseItem[] | undefined;
  isLoading: boolean;
}

const PIE_COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#06b6d4"];

export default function ExpenseChart({ data, isLoading }: Props) {
  const items = data ?? [];
  const total = items.reduce((s, i) => s + (i.total ?? 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Expense Breakdown</h2>
        <p className="text-xs text-slate-500 mt-0.5">Distribution by category</p>
      </div>
      {isLoading ? (
        <div className="p-6 animate-pulse"><div className="h-64 bg-slate-200 rounded-xl" /></div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm font-semibold text-slate-500">No expense data available</p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <ReactApexChart
              options={{
                chart: { type: "donut", fontFamily: "Outfit, sans-serif" },
                labels: items.map((i) => i.category),
                colors: PIE_COLORS,
                legend: { show: false },
                dataLabels: { enabled: false },
                tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "65%",
                      labels: {
                        show: true,
                        total: { show: true, label: "Total", fontFamily: "Outfit, sans-serif", formatter: () => `$${total.toLocaleString()}` },
                      },
                    },
                  },
                },
              }}
              series={items.map((i) => i.total ?? 0)}
              type="donut"
              height={280}
            />
          </div>
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="pb-2 text-left">Category</th>
                  <th className="pb-2 text-right">Amount</th>
                  <th className="pb-2 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((i, idx) => (
                  <tr key={i.category ?? idx} className="text-sm">
                    <td className="py-2.5 flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                      <span className="text-slate-700 font-medium">{i.category}</span>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-800">${(i.total ?? 0).toLocaleString()}</td>
                    <td className="py-2.5 text-right text-slate-600">{total > 0 ? ((i.total / total) * 100).toFixed(1) : "0.0"}%</td>
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

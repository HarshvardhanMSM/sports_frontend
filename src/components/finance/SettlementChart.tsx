"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type { SettlementItem } from "@/types/financial-report.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: SettlementItem[] | undefined;
  isLoading: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#10b981",
  PENDING: "#f59e0b",
  PROCESSING: "#6366f1",
};

export default function SettlementChart({ data, isLoading }: Props) {
  const items = data ?? [];
  const total = items.reduce((s, i) => s + (i.total ?? 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[396px] flex flex-col">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Settlement Summary</h2>
          <p className="text-xs text-slate-500 mt-0.5">Breakdown by status</p>
        </div>
        {items.length > 0 && (
          <p className="text-sm font-bold text-slate-800">Total: ${total.toLocaleString()}</p>
        )}
      </div>
      {isLoading ? (
        <div className="p-6 flex-1 flex items-center justify-center animate-pulse">
          <div className="h-[280px] w-full bg-slate-100 rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-semibold text-slate-500">No settlement data available</p>
        </div>
      ) : (
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-center">
            <div className="flex justify-center">
              <ReactApexChart
                options={{
                  chart: { type: "donut", fontFamily: "Outfit, sans-serif" },
                  labels: items.map((i) => i.status),
                  colors: items.map((i) => STATUS_COLORS[i.status] ?? "#94a3b8"),
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
                height={240}
              />
            </div>
            <div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="pb-2 text-left">Status</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Count</th>
                    <th className="pb-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((i) => (
                    <tr key={i.status} className="text-sm">
                      <td className="py-2 flex items-center gap-2">
                        <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[i.status] ?? "#94a3b8" }} />
                        <span className="text-slate-700 font-medium capitalize">{i.status.toLowerCase()}</span>
                      </td>
                      <td className="py-2 text-right font-semibold text-slate-800">${(i.total ?? 0).toLocaleString()}</td>
                      <td className="py-2 text-right text-slate-600">{i.count ?? 0}</td>
                      <td className="py-2 text-right text-slate-600">{total > 0 ? ((i.total / total) * 100).toFixed(1) : "0.0"}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

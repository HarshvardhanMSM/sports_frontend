"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type { ReturnReason } from "@/types/return-analytics.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: ReturnReason[] | undefined;
  isLoading: boolean;
}

const DONUT_COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#06b6d4"];

export default function ReturnReasonsChart({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="flex justify-center">
            <div className="size-48 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm font-semibold text-slate-500">No return reasons data available</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((s, r) => s + Number(r.count ?? 0), 0);

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "Outfit, sans-serif" },
    labels: data.map((r) => (r.reason ?? "Unknown").replace(/_/g, " ")),
    colors: DONUT_COLORS,
    legend: { position: "bottom", fontSize: "12px", fontFamily: "Outfit, sans-serif" },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val: number) => `${val} returns` },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              formatter: () => total.toString(),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 300 }, legend: { position: "bottom" } },
      },
    ],
  };

  const series = data.map((r) => Number(r.count ?? 0));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Return Reasons</h2>
        <p className="text-xs text-slate-500 mt-0.5">Distribution of return reasons</p>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" height={280} />
        </div>
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-2 text-left">Reason</th>
                <th className="pb-2 text-right">Count</th>
                <th className="pb-2 text-right">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((r, i) => (
                <tr key={r.reason ?? i} className="text-sm">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span className="text-slate-700">{(r.reason ?? "Unknown").replace(/_/g, " ")}</span>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-800">{Number(r.count ?? 0).toLocaleString()}</td>
                  <td className="py-2.5 text-right text-slate-600">{total > 0 ? ((Number(r.count ?? 0) / total) * 100).toFixed(1) : "0.0"}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

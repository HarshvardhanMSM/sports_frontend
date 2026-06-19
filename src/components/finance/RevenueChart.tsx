"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FiDollarSign } from "react-icons/fi";
import type { RevenueItem } from "@/types/financial-report.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: RevenueItem[] | undefined;
  isLoading: boolean;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RevenueChart({ data, isLoading }: Props) {
  const items = data ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Revenue Trend</h2>
        <p className="text-xs text-slate-500 mt-0.5">Daily revenue and transaction volume</p>
      </div>
      {isLoading ? (
        <div className="p-6 animate-pulse"><div className="h-64 bg-slate-200 rounded-xl" /></div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FiDollarSign className="size-8 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-500">No revenue data available</p>
        </div>
      ) : (
        <div className="p-6">
          <ReactApexChart
            options={{
              chart: { type: "line", fontFamily: "Outfit, sans-serif", toolbar: { show: false }, zoom: { enabled: false } },
              colors: ["#6366f1", "#10b981"],
              xaxis: {
                type: "datetime",
                categories: items.map((m) => m.date),
                labels: {
                  format: "MMM dd",
                  style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: [
                {
                  labels: {
                    style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" },
                    formatter: (val: number) => `$${(val / 1000).toFixed(0)}K`,
                  },
                },
                {
                  opposite: true,
                  labels: {
                    style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" },
                    formatter: (val: number) => val.toFixed(0),
                  },
                },
              ],
              grid: { borderColor: "#f1f5f9", strokeDashArray: 0 },
              stroke: { curve: "smooth", width: [3, 2] },
              markers: { size: [4, 0], colors: ["#6366f1"], strokeColors: "#fff", strokeWidth: 2 },
              tooltip: {
                shared: true,
                x: { format: "MMM dd, yyyy" },
                y: [
                  { formatter: (val: number) => `$${val.toLocaleString()}` },
                  { formatter: (val: number) => `${val} transactions` },
                ],
              },
              dataLabels: { enabled: false },
              fill: {
                type: "gradient",
                gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 90, 100] },
              },
            }}
            series={[
              { name: "Revenue", data: items.map((m) => ({ x: new Date(m.date).getTime(), y: m.revenue ?? 0 })) },
              { name: "Transactions", data: items.map((m) => ({ x: new Date(m.date).getTime(), y: m.transactions ?? 0 })) },
            ]}
            type="area"
            height={340}
          />
        </div>
      )}
    </div>
  );
}

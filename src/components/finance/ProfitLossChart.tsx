"use client";

import React from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ProfitLossItem {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface Props {
  data: { trend: ProfitLossItem[]; netProfit: number; margin: number } | undefined;
  isLoading: boolean;
}

export default function ProfitLossChart({ data, isLoading }: Props) {
  const trend = data?.trend ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Profit & Loss</h2>
          <p className="text-xs text-slate-500 mt-0.5">Revenue vs expenses over time</p>
        </div>
        {data && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Net Profit</p>
              <p className="text-sm font-bold text-slate-800">${(data.netProfit ?? 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Margin</p>
              <p className="text-sm font-bold text-emerald-600">{(data.margin ?? 0).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="p-6 animate-pulse"><div className="h-64 bg-slate-200 rounded-xl" /></div>
      ) : trend.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm font-semibold text-slate-500">No profit & loss data available</p>
        </div>
      ) : (
        <div className="p-6">
          <ReactApexChart
            options={{
              chart: { type: "bar", fontFamily: "Outfit, sans-serif", toolbar: { show: false }, stacked: false },
              colors: ["#10b981", "#ef4444", "#6366f1"],
              xaxis: {
                categories: trend.map((m) => m.month ?? ""),
                labels: { style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" } },
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: {
                labels: {
                  style: { colors: "#64748b", fontFamily: "Outfit, sans-serif" },
                  formatter: (val: number) => `$${(val / 1000).toFixed(0)}K`,
                },
              },
              grid: { borderColor: "#f1f5f9" },
              legend: { position: "top", fontFamily: "Outfit, sans-serif", fontSize: "12px" },
              tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
              plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
              dataLabels: { enabled: false },
            }}
            series={[
              { name: "Revenue", data: trend.map((m) => m.revenue ?? 0) },
              { name: "Expenses", data: trend.map((m) => m.expenses ?? 0) },
              { name: "Profit", data: trend.map((m) => m.profit ?? 0) },
            ]}
            type="bar"
            height={320}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import { FiDollarSign } from "react-icons/fi";
import type { RevenueItem } from "@/types/financial-report.types";

interface Props {
  data: RevenueItem[] | undefined;
  isLoading: boolean;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RevenueTable({ data, isLoading }: Props) {
  const items = data ?? [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="px-6 py-5 border-b border-slate-100"><div className="h-5 w-40 bg-slate-200 rounded" /></div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiDollarSign className="size-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No revenue data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Revenue Breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Transactions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row, i) => (
              <tr key={row.date ?? i} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4 text-sm font-semibold text-slate-700">{fmtDate(row.date)}</td>
                <td className="px-5 py-4 text-sm font-bold text-slate-800 text-right">${(row.revenue ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-slate-600 text-right">{row.transactions ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

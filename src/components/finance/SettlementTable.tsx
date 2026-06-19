"use client";

import { FiCreditCard } from "react-icons/fi";
import type { SettlementItem } from "@/types/financial-report.types";

interface Props {
  data: SettlementItem[] | undefined;
  isLoading: boolean;
}

export default function SettlementTable({ data, isLoading }: Props) {
  const items = data ?? [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="px-6 py-5 border-b border-slate-100"><div className="h-5 w-40 bg-slate-200 rounded" /></div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <FiCreditCard className="size-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No settlement data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Settlement History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((row) => (
              <tr key={row.status} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    row.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                    row.status === "PROCESSING" ? "bg-indigo-50 text-indigo-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>
                    {row.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-800 text-right">${(row.total ?? 0).toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-slate-600 text-right">{row.count ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import type { InventoryAudit } from "@/types/inventory.types";

interface StockMovementTableProps {
  items: InventoryAudit[];
}

const TYPE_BADGE: Record<string, string> = {
  STOCK_IN: "bg-emerald-50 text-emerald-700",
  SALE: "bg-blue-50 text-blue-700",
  RETURN: "bg-purple-50 text-purple-700",
  ADJUSTMENT: "bg-amber-50 text-amber-700",
  DAMAGE_WRITEOFF: "bg-red-50 text-red-700",
};

function ActionBadge({ actionType }: { actionType?: string }) {
  const type = actionType ?? "ADJUSTMENT";
  const cls = TYPE_BADGE[type] ?? "bg-slate-100 text-slate-600";
  const label = type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

export default function StockMovementTable({ items }: StockMovementTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date / Time</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Change</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Before</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">After</th>
            {/* <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No movements found.</td>
            </tr>
          ) : (
            items.map((mv) => {
              const diff = mv.afterQuantity - mv.beforeQuantity;
              return (
                <tr key={mv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap font-mono">
                    {new Date(mv.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{mv.variantSku ?? mv.variantId?.slice(0, 8) ?? "N/A"}</p>
                  </td>
                  <td className="px-4 py-4"><ActionBadge actionType={mv.actionType} /></td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-bold ${diff > 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{mv.beforeQuantity}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{mv.afterQuantity}</td>
                  {/* <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {mv.referenceId ? `${mv.referenceType ?? ""}-${String(mv.referenceId).slice(0, 8)}` : "-"}
                  </td> */}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

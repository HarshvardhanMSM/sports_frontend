"use client";

import React from "react";
import { FiCheck } from "react-icons/fi";
import type { StockAlert } from "@/types/inventory.types";

interface InventoryAlertTableProps {
  items: StockAlert[];
  onResolve?: (id: string) => void;
  resolvingId?: string | null;
}

function PriorityBadge({ alertType }: { alertType: string }) {
  if (alertType === "OUT_OF_STOCK") {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">Critical</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Warning</span>;
}

export default function InventoryAlertTable({ items, onResolve, resolvingId }: InventoryAlertTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Type</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current / Threshold</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
            {onResolve && <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={onResolve ? 6 : 5} className="px-4 py-10 text-center text-sm text-slate-400">No alerts found.</td>
            </tr>
          ) : (
            items.map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-800">{alert.variantSku ?? alert.variantId?.slice(0, 8) ?? "N/A"}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {alert.alertType === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {alert.currentQuantity != null ? `${alert.currentQuantity} / ${alert.thresholdQuantity ?? "?"}` : "-"}
                </td>
                <td className="px-4 py-4"><PriorityBadge alertType={alert.alertType} /></td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {new Date(alert.createdAt).toLocaleDateString()}
                </td>
                {onResolve && (
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onResolve(alert.id)}
                      disabled={resolvingId === alert.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-40"
                    >
                      <FiCheck className="size-3.5" /> {resolvingId === alert.id ? "..." : "Resolve"}
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

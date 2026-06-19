"use client";

import React from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { InventoryItem } from "@/types/inventory.types";
import Badge from "@/components/ui/badge/Badge";

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

function StockBar({ stock, threshold }: { stock: number; threshold: number }) {
  const pct = threshold > 0 ? Math.min((stock / (threshold * 3)) * 100, 100) : 0;
  const color =
    stock === 0 ? "bg-rose-500" : stock < threshold ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-8 text-right">{stock}</span>
    </div>
  );
}

function getStatus(item: InventoryItem): { label: string; color: "success" | "warning" | "error" } {
  if (item.availableQuantity <= 0) return { label: "Out of Stock", color: "error" };
  if (item.availableQuantity <= item.lowStockThreshold) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
}

export default function InventoryTable({ items, onDelete, deletingId }: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-4">SKU</th>
            <th className="px-5 py-4">Stock Level</th>
            <th className="px-5 py-4">Reserved</th>
            <th className="px-5 py-4">Available</th>
            <th className="px-5 py-4">Reorder</th>
            <th className="px-5 py-4">Threshold</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Last Updated</th>
            {/* <th className="px-5 py-4 text-right">Actions</th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-5 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <svg className="size-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">No inventory items found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const status = getStatus(item);
              return (
                <tr key={item.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{item.variantSku ?? item.variantId?.slice(0, 8) ?? "N/A"}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.id.slice(0, 8)}...</p>
                  </td>
                  <td className="px-5 py-4">
                    <StockBar stock={item.quantity} threshold={item.lowStockThreshold} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {item.reservedQuantity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-slate-800">{item.availableQuantity}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {item.reorderPoint != null ? `${item.reorderPoint} / ${item.reorderQuantity ?? "-"}` : "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {item.lowStockThreshold}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={status.color}>{status.label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  {/* <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/inventory/${item.id}/edit`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      >
                        <FiEdit2 className="size-4" />
                      </Link>
                      <button
                        onClick={() => onDelete?.(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
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

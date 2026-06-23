"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2, FiMinusCircle, FiLock, FiUnlock, FiMoreVertical } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import type { InventoryItem } from "@/types/inventory.types";
import Badge from "@/components/ui/badge/Badge";

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  onAdjust?: (item: InventoryItem) => void;
  onReserve?: (item: InventoryItem) => void;
  onRelease?: (item: InventoryItem) => void;
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

function ActionDropdown({ item, onDelete, deletingId, onAdjust, onReserve, onRelease }: {
  item: InventoryItem;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  onAdjust?: (item: InventoryItem) => void;
  onReserve?: (item: InventoryItem) => void;
  onRelease?: (item: InventoryItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <FiMoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-40 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
          <Link
            href={`/inventory/${item.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FiEye className="size-4 text-slate-400" />
            View Details
          </Link>
          <Can permission="inventory.update">
            <Link
              href={`/inventory/${item.id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FiEdit2 className="size-4 text-slate-400" />
              Edit
            </Link>
          </Can>
          <div className="border-t border-slate-100 my-1" />
          <Can permission="inventory.adjust">
            <button
              onClick={() => { setOpen(false); onAdjust?.(item); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <FiMinusCircle className="size-4 text-slate-400" />
              Adjust Stock
            </button>
          </Can>
          <button
            onClick={() => { setOpen(false); onReserve?.(item); }}
            disabled={item.availableQuantity <= 0}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors text-left ${
              item.availableQuantity <= 0
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FiLock className="size-4 text-slate-400" />
            Reserve Stock
          </button>
          <button
            onClick={() => { setOpen(false); onRelease?.(item); }}
            disabled={item.reservedQuantity <= 0}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors text-left ${
              item.reservedQuantity <= 0
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FiUnlock className="size-4 text-slate-400" />
            Release Stock
          </button>
          <div className="border-t border-slate-100 my-1" />
          <Can permission="inventory.delete">
            <button
              onClick={() => { setOpen(false); onDelete?.(item.id); }}
              disabled={deletingId === item.id}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left disabled:opacity-40"
            >
              <FiTrash2 className="size-4" />
              Delete
            </button>
          </Can>
        </div>
      )}
    </div>
  );
}

export default function InventoryTable({ items, onDelete, deletingId, onAdjust, onReserve, onRelease }: InventoryTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-4">SKU</th>
            <th className="px-5 py-4">Stock Level</th>
            <th className="px-5 py-4">Reserved</th>
            <th className="px-5 py-4">Available</th>
            {/* <th className="px-5 py-4">Reorder</th> */}
            <th className="px-5 py-4">Threshold</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Last Updated</th>
            <th className="px-5 py-4 text-right">Actions</th>
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
                  {/* <td className="px-5 py-4 text-sm text-slate-700">
                    {item.reorderPoint != null ? `${item.reorderPoint} / ${item.reorderQuantity ?? "-"}` : "-"}
                  </td> */}
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
                  <td className="px-5 py-4 text-right">
                    <ActionDropdown
                      item={item}
                      onDelete={onDelete}
                      deletingId={deletingId}
                      onAdjust={onAdjust}
                      onReserve={onReserve}
                      onRelease={onRelease}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

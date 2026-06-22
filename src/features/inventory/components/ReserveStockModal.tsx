"use client";

import React, { useState } from "react";
import { FiX, FiMinus, FiPlus, FiAlertCircle } from "react-icons/fi";
import type { InventoryItem } from "@/types/inventory.types";

interface ReserveStockModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isPending: boolean;
}

export default function ReserveStockModal({ item, onClose, onSubmit, isPending }: ReserveStockModalProps) {
  const [quantity, setQuantity] = useState<number>(0);

  const isValid = quantity > 0 && quantity <= item.availableQuantity;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Reserve Stock</h2>
            <p className="text-xs text-slate-500 mt-0.5">{item.variantSku ?? item.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <FiX className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Available to Reserve</span>
              <span className="font-bold text-emerald-600">{item.availableQuantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Already Reserved</span>
              <span className="font-bold text-amber-600">{item.reservedQuantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Stock</span>
              <span className="font-bold text-slate-800">{item.quantity}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Quantity to Reserve
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
              >
                <FiMinus className="size-4" />
              </button>
              <input
                type="number"
                min={0}
                max={item.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Math.min(item.availableQuantity, parseInt(e.target.value) || 0)))}
                className="flex-1 text-center text-lg font-bold text-slate-900 rounded-xl border border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
              <button
                onClick={() => setQuantity(Math.min(item.availableQuantity, quantity + 1))}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
              >
                <FiPlus className="size-4" />
              </button>
            </div>
          </div>

          {quantity > 0 && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-600">After Reservation</span>
                <span className="font-bold text-indigo-900">{item.availableQuantity - quantity} available</span>
              </div>
            </div>
          )}

          {quantity > item.availableQuantity && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3">
              <FiAlertCircle className="size-4 text-rose-500 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-700">Cannot reserve more than available stock.</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            {isPending ? "Reserving..." : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
}

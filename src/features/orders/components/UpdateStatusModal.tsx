"use client";

import React, { useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";
import type { OrderStatus } from "@/types/order.types";

interface UpdateStatusModalProps {
  currentStatus: OrderStatus;
  onClose: () => void;
  onConfirm: (status: OrderStatus) => void;
  isPending: boolean;
}

const STATUS_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING:           ["CONFIRMED", "CANCELLED"],
  CONFIRMED:         ["PROCESSING", "CANCELLED"],
  PROCESSING:        ["PACKED", "CANCELLED"],
  PACKED:            ["SHIPPED", "CANCELLED"],
  SHIPPED:           ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY:  ["DELIVERED", "CANCELLED"],
  DELIVERED:         [],
  CANCELLED:         [],
  RETURN_REQUESTED:  ["RETURNED"],
  RETURNED:          [],
};

const LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
};

export default function UpdateStatusModal({ currentStatus, onClose, onConfirm, isPending }: UpdateStatusModalProps) {
  const [selected, setSelected] = useState<OrderStatus | null>(null);
  const transitions = STATUS_TRANSITIONS[currentStatus] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Update Order Status</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
            {LABELS[currentStatus] ?? currentStatus}
          </span>
        </div>

        {transitions.length > 0 ? (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Change To</p>
            {transitions.map((status) => (
              <button
                key={status}
                onClick={() => setSelected(status)}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  selected === status
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FiArrowRight className={`size-4 ${selected === status ? "text-indigo-600" : "text-slate-400"}`} />
                {LABELS[status] ?? status}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 mb-6 text-center py-4">No further status transitions available.</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected || isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import type { ShipmentStatus } from "@/types/shipment.types";

interface Props {
  trackingNumber: string;
  currentStatus: ShipmentStatus;
  onClose: () => void;
  onConfirm: (data: { status: string; notes?: string }) => void;
  isPending: boolean;
}

const STATUS_OPTIONS: ShipmentStatus[] = [
  "PENDING",
  "PACKED",
  "READY_FOR_DISPATCH",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_DELIVERY",
];

export default function UpdateShipmentStatusModal({
  trackingNumber, currentStatus, onClose, onConfirm, isPending,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50">
            <FiEdit2 className="size-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Update Status</h2>
            <p className="text-xs text-slate-500 font-mono">{trackingNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note about this status update..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ status, notes: notes || undefined })}
            disabled={isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

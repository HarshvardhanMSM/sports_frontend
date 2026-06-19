"use client";

import React, { useState } from "react";
import { FiTruck, FiX } from "react-icons/fi";

interface Props {
  returnNumber: string;
  onClose: () => void;
  onConfirm: (data: { pickupDate: string; courierName: string; notes?: string }) => void;
  isPending: boolean;
}

export default function SchedulePickupModal({ returnNumber, onClose, onConfirm, isPending }: Props) {
  const [pickupDate, setPickupDate] = useState("");
  const [courierName, setCourierName] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-violet-50">
              <FiTruck className="size-5 text-violet-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Schedule Pickup</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Schedule pickup for <span className="font-semibold text-slate-800">{returnNumber}</span>
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Pickup Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Courier
            </label>
            <input
              type="text"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              placeholder="Enter courier name..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Pickup Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional instructions for pickup..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ pickupDate, courierName: courierName || "Other", notes: notes || undefined })}
            disabled={!pickupDate || !courierName || isPending}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isPending ? "Scheduling..." : "Schedule Pickup"}
          </button>
        </div>
      </div>
    </div>
  );
}

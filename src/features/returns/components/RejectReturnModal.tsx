"use client";

import React, { useState } from "react";
import { FiXCircle, FiX } from "react-icons/fi";

interface Props {
  returnNumber: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export default function RejectReturnModal({ returnNumber, onClose, onConfirm, isPending }: Props) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-rose-50">
              <FiXCircle className="size-5 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Reject Return</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Reject return <span className="font-semibold text-slate-800">{returnNumber}</span>?
        </p>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Rejection Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100 placeholder:text-slate-400 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || isPending}
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {isPending ? "Rejecting..." : "Reject Return"}
          </button>
        </div>
      </div>
    </div>
  );
}

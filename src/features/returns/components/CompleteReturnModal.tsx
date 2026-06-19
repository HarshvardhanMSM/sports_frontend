"use client";

import React from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

interface Props {
  returnNumber: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function CompleteReturnModal({ returnNumber, onClose, onConfirm, isPending }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50">
              <FiCheckCircle className="size-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Complete Return</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Mark return <span className="font-semibold text-slate-800">{returnNumber}</span> as completed?
          This will close the return request.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? "Completing..." : "Complete Return"}
          </button>
        </div>
      </div>
    </div>
  );
}

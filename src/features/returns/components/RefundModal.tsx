"use client";

import React, { useState } from "react";
import { FiDollarSign, FiX } from "react-icons/fi";

interface Props {
  returnNumber: string;
  refundAmount: string;
  onClose: () => void;
  onConfirm: (data: { amount: string; method: string }) => void;
  isPending: boolean;
}

export default function RefundModal({ returnNumber, refundAmount, onClose, onConfirm, isPending }: Props) {
  const [amount, setAmount] = useState(refundAmount);
  const [method, setMethod] = useState("Original Payment");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-50">
              <FiDollarSign className="size-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Process Refund</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Process refund for <span className="font-semibold text-slate-800">{returnNumber}</span>
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Refund Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Refund Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="Original Payment">Original Payment</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Store Credit">Store Credit</option>
              <option value="Gift Card">Gift Card</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ amount, method })}
            disabled={!amount || !method || isPending}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Process Refund"}
          </button>
        </div>
      </div>
    </div>
  );
}

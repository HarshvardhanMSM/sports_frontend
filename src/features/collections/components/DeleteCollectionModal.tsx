"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface DeleteCollectionModalProps {
  collectionName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  error?: string;
}

export default function DeleteCollectionModal({
  collectionName,
  onClose,
  onConfirm,
  isPending,
  error,
}: DeleteCollectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-50"><FiAlertTriangle className="size-6 text-red-500" /></div>
          <h3 className="text-base font-bold text-slate-800">Delete Collection</h3>
          <p className="text-sm text-slate-500">Are you sure you want to delete <span className="font-semibold text-slate-700">{collectionName}</span>? This action cannot be undone.</p>
        </div>
        {error && <p className="mt-3 text-center text-xs font-semibold text-rose-600">{error}</p>}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button onClick={onClose} disabled={isPending} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={isPending} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">{isPending ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

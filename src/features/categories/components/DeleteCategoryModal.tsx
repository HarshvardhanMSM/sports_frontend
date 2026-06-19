"use client";

import { useEffect } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

interface DeleteCategoryModalProps {
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  error?: string;
}

export default function DeleteCategoryModal({
  categoryName,
  onClose,
  onConfirm,
  isPending,
  error,
}: DeleteCategoryModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Delete Category</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="flex items-start gap-3 mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <FiAlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Are you sure you want to delete this category?
            </p>
            <p className="text-xs text-red-600 mt-1">
              This action will soft-delete <strong className="font-semibold">{categoryName}</strong>. It can be recovered later if needed.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

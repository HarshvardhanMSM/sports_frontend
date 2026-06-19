"use client";

import { FiAlertTriangle, FiX, FiStar } from "react-icons/fi";

interface DeleteReviewModalProps {
  reviewTitle: string;
  customerName: string;
  rating: number;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteReviewModal({
  reviewTitle,
  customerName,
  rating,
  onClose,
  onConfirm,
  isPending,
}: DeleteReviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-50">
              <FiAlertTriangle className="size-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Delete Review</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          <div className="text-sm space-y-1">
            <p><span className="font-semibold text-slate-800">Title:</span> {reviewTitle}</p>
            <p><span className="font-semibold text-slate-800">Customer:</span> {customerName}</p>
            <p className="flex items-center gap-1">
              <span className="font-semibold text-slate-800">Rating:</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`size-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                  />
                ))}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

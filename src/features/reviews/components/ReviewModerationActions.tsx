"use client";

import React from "react";
import { FiCheck, FiX, FiEyeOff, FiTrash2 } from "react-icons/fi";

interface ReviewModerationActionsProps {
  status: string;
  onApprove: () => void;
  onReject: () => void;
  onHide: () => void;
  onDelete: () => void;
  isApproving: boolean;
  isRejecting: boolean;
  isHiding: boolean;
  isDeleting: boolean;
}

export default function ReviewModerationActions({
  status,
  onApprove,
  onReject,
  onHide,
  onDelete,
  isApproving,
  isRejecting,
  isHiding,
  isDeleting,
}: ReviewModerationActionsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Moderation Actions</h2>
      </div>
      <div className="p-6 space-y-3">
        {/* {status !== "APPROVED" && (
          <button
            onClick={onApprove}
            disabled={isApproving}
            className="w-full flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-200">
              <FiCheck className="size-4 text-emerald-700" />
            </div>
            <div className="text-left">
              <p>Approve Review</p>
              <p className="text-xs font-normal text-emerald-600">Make this review publicly visible</p>
            </div>
            {isApproving && <span className="ml-auto text-xs">Processing...</span>}
          </button>
        )}

        {status !== "REJECTED" && (
          <button
            onClick={onReject}
            disabled={isRejecting}
            className="w-full flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-200">
              <FiX className="size-4 text-rose-700" />
            </div>
            <div className="text-left">
              <p>Reject Review</p>
              <p className="text-xs font-normal text-rose-600">Remove this review from public view</p>
            </div>
            {isRejecting && <span className="ml-auto text-xs">Processing...</span>}
          </button>
        )}

        {status !== "HIDDEN" && (
          <button
            onClick={onHide}
            disabled={isHiding}
            className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200">
              <FiEyeOff className="size-4 text-slate-700" />
            </div>
            <div className="text-left">
              <p>Hide Review</p>
              <p className="text-xs font-normal text-slate-500">Review remains stored but hidden from public</p>
            </div>
            {isHiding && <span className="ml-auto text-xs">Processing...</span>}
          </button>
        )} */}

        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full flex items-center gap-3 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50">
              <FiTrash2 className="size-4 text-rose-600" />
            </div>
            <div className="text-left">
              <p>Delete Review</p>
              <p className="text-xs font-normal text-rose-500">Permanently remove this review</p>
            </div>
            {isDeleting && <span className="ml-auto text-xs">Deleting...</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

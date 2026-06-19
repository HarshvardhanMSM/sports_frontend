"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";
import type { PermissionSlug } from "@/types/role.types";

interface DeletePermissionDialogProps {
  permission: PermissionSlug;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeletePermissionDialog({ permission, onClose, onConfirm, isPending }: DeletePermissionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-50">
              <FiAlertTriangle className="size-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Delete Permission</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-800">{permission.name}</span>?
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isPending} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

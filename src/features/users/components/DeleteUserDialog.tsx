"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import type { User } from "@/types/user.types";

interface Props {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteUserDialog({ user, onClose, onConfirm, isPending }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-rose-50">
            <FiTrash2 className="size-5 text-rose-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Delete User</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-800">{user.name}</span> ({user.email})? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isPending} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
            {isPending ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}

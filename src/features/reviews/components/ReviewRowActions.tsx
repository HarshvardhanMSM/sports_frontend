"use client";

import React from "react";
import Link from "next/link";
import { FiMoreHorizontal, FiEye,  FiTrash2 } from "react-icons/fi";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";

interface ReviewRowActionsProps {
  id: string;
  status: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReviewRowActions({
  id,
  // status,
  // onApprove,
  // onReject,
  // onHide,
  onDelete,
}: ReviewRowActionsProps) {
  const { ref: dropdownRef, open, setOpen, direction } = useDropdownDirection();

  const close = () => setOpen(false);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700"
      >
        <FiMoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className={`absolute right-0 z-50 w-40 rounded-lg bg-white p-1 shadow-lg border border-slate-200 focus:outline-none ${direction === "up" ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"}`}>
          <Link
            href={`/product-reviews/${id}`}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            onClick={close}
          >
            <FiEye className="size-3.5" />
            View
          </Link>
          {/* {status !== "APPROVED" && (
            <button
              type="button"
              onClick={() => { onApprove(id); close(); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <FiCheck className="size-3.5" />
              Approve
            </button>
          )}
          {status !== "REJECTED" && (
            <button
              type="button"
              onClick={() => { onReject(id); close(); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <FiX className="size-3.5" />
              Reject
            </button>
          )}
          {status !== "HIDDEN" && (
            <button
              type="button"
              onClick={() => { onHide(id); close(); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            >
              <FiEyeOff className="size-3.5" />
              Hide
            </button>
          )} */}
          <div className="border-t border-slate-100 my-1" />
          <button
            type="button"
            onClick={() => { onDelete(id); close(); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <FiTrash2 className="size-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

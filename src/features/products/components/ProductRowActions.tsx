"use client";

import React from "react";
import Link from "next/link";
import { FiMoreHorizontal, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";

interface ProductRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function ProductRowActions({
  id,
  onDelete,
}: ProductRowActionsProps) {
  const { ref: dropdownRef, open, setOpen, direction } = useDropdownDirection();

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
        <div className={`absolute right-0 z-50 w-36 rounded-lg bg-white p-1 shadow-lg border border-slate-200 focus:outline-none ${direction === "up" ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"}`}>
          <Link
            href={`/products/${id}`}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <FiEye className="size-3.5" />
            View Details
          </Link>
          <Can permission="product.update">
            <Link
              href={`/products/edit/${id}`}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <FiEdit className="size-3.5" />
              Edit
            </Link>
          </Can>
          <Can permission="product.delete">
            <button
              type="button"
              onClick={() => {
                onDelete(id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <FiTrash2 className="size-3.5" />
              Delete
            </button>
          </Can>
        </div>
      )}
    </div>
  );
}

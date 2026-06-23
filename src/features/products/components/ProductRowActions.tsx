"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiMoreHorizontal, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { Can } from "@/components/common/Can";

interface ProductRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function ProductRowActions({
  id,
  onDelete,
}: ProductRowActionsProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="absolute right-0 z-50 mt-1 w-36 origin-top-right rounded-lg bg-white p-1 shadow-lg border border-slate-200 focus:outline-none">
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
                if (confirm("Are you sure you want to delete this product?")) {
                  onDelete(id);
                }
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

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiMoreHorizontal, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

interface SubCategoryRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function SubCategoryRowActions({ id, onDelete }: SubCategoryRowActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700"
      >
        <FiMoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded-lg bg-white p-1 shadow-lg border border-slate-200">
          <Link
            href={`/sub-categories/${id}`}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <FiEye className="size-3.5" />
            View Details
          </Link>
          <Link
            href={`/sub-categories/${id}/edit`}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <FiEdit className="size-3.5" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); if (id) onDelete(id); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            <FiTrash2 className="size-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

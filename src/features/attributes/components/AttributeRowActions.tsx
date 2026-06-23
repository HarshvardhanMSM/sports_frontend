"use client";

import Link from "next/link";
import { FiMoreHorizontal, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";

interface AttributeRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function AttributeRowActions({ id, onDelete }: AttributeRowActionsProps) {
  const { ref, open, setOpen, direction } = useDropdownDirection();

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
        <div className={`absolute right-0 z-50 w-40 rounded-lg bg-white p-1 shadow-lg border border-slate-200 ${direction === "up" ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"}`}>
          <Link
            href={`/attributes/${id}`}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <FiEye className="size-3.5" />
            View Details
          </Link>
          <Can permission="attribute.update">
            <Link
              href={`/attributes/${id}/edit`}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <FiEdit className="size-3.5" />
              Edit
            </Link>
          </Can>
          <Can permission="attribute.delete">
            <button
              type="button"
              onClick={() => { setOpen(false); if (id) onDelete(id); }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
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

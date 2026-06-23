"use client";

import Link from "next/link";
import { FiMoreHorizontal, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";

interface CategoryRowActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function CategoryRowActions({ id, onDelete }: CategoryRowActionsProps) {
  const { ref, open, setOpen, direction } = useDropdownDirection();

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => {
          console.log("[RowActions] toggle open", !open, "id:", id);
          setOpen(!open);
        }}
        className="flex items-center justify-center p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700"
      >
        <FiMoreHorizontal className="size-4" />
      </button>

      {open && (
        <div className={`absolute right-0 z-50 w-40 rounded-lg bg-white p-1 shadow-lg border border-slate-200 ${direction === "up" ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"}`}>
          <Can permission="category.update">
            <Link
              href={`/categories/${id}/edit`}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <FiEye className="size-3.5" />
              View & Edit
            </Link>
          </Can>
          <Can permission="category.update">
            <Link
              href={`/categories/${id}/edit`}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <FiEdit className="size-3.5" />
              Edit
            </Link>
          </Can>
          <Can permission="category.delete">
            <button
              type="button"
              onClick={() => {
                console.log("[RowActions] Delete clicked, id:", id, "type:", typeof id);
                setOpen(false);
                if (id) {
                  onDelete(id);
                } else {
                  console.error("[RowActions] id is falsy, cannot delete");
                }
              }}
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

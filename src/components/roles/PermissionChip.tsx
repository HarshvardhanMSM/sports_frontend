"use client";

import { FiCheck } from "react-icons/fi";

interface PermissionChipProps {
  slug: string;
  name: string;
  selected: boolean;
  onToggle: (slug: string) => void;
}

export default function PermissionChip({
  slug,
  name,
  selected,
  onToggle,
}: PermissionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(slug)}
      className={`
        inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium
        transition-all duration-150
        ${
          selected
            ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
        }
      `}
    >
      <span
        className={`
          flex size-3.5 items-center justify-center rounded border transition-colors
          ${
            selected
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-300 bg-white"
          }
        `}
      >
        {selected && <FiCheck className="size-2.5 stroke-[3]" />}
      </span>
      {name}
    </button>
  );
}

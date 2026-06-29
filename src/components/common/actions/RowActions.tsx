"use client";

import React from "react";
import Link from "next/link";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";
import { Can } from "@/components/common/Can";

export interface RowActionItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  permission?: string;
}

interface RowActionsProps {
  actions: RowActionItem[];
}

export function RowActions({ actions }: RowActionsProps) {
  const { ref, open, setOpen, direction } = useDropdownDirection();

  const hasDanger = actions.some((a) => a.variant === "danger");
  const width = hasDanger ? "w-40" : "w-36";

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
        <div
          className={`absolute right-0 z-50 ${width} rounded-lg bg-white p-1 shadow-lg border border-slate-200 focus:outline-none ${
            direction === "up"
              ? "bottom-full mb-1 origin-bottom-right"
              : "top-full mt-1 origin-top-right"
          }`}
        >
          {actions.map((action) => {
            const Icon = action.icon;

            const item = action.href ? (
              <Link
                href={action.href}
                onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold ${
                  action.variant === "danger"
                    ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="size-3.5" />
                {action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs font-semibold ${
                  action.variant === "danger"
                    ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="size-3.5" />
                {action.label}
              </button>
            );

            if (action.permission) {
              return <Can key={action.label} permission={action.permission}>{item}</Can>;
            }

            return <React.Fragment key={action.label}>{item}</React.Fragment>;
          })}
        </div>
      )}
    </div>
  );
}

export default RowActions;

"use client";

import { FiTrash2, FiEdit2 } from "react-icons/fi";
import type { PermissionSlug } from "@/types/role.types";

interface PermissionTableProps {
  permissions: PermissionSlug[];
  onEdit?: (permission: PermissionSlug) => void;
  onDelete?: (permission: PermissionSlug) => void;
}

export default function PermissionTable({ permissions, onEdit, onDelete }: PermissionTableProps) {
  if (permissions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-sm text-slate-400">No permissions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Module</th>
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {permissions.map((p) => (
              <tr key={p.slug} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3">
                  <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">{p.slug}</code>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                    {p.module}
                  </span>
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <FiEdit2 className="size-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

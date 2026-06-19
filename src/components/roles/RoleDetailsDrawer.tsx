"use client";

import { useEffect } from "react";
import { FiX, FiEdit2, FiCopy, FiTrash2, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import type { Role } from "@/types/role.types";

interface RoleDetailsDrawerProps {
  role: Role;
  onClose: () => void;
  onEdit: (role: Role) => void;
  onDuplicate: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleDetailsDrawer({
  role,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}: RoleDetailsDrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const totalPerms = role.permissions.reduce((s, p) => s + p.actions.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-base font-bold text-slate-800">Role Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Role Identity */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FiUsers className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{role.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    role.isSystemRole
                      ? "bg-slate-100 text-slate-600"
                      : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {role.isSystemRole ? "System Role" : "Custom Role"}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {role.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="size-4 text-slate-400 shrink-0" />
              <span className="text-slate-500">Created</span>
              <span className="ml-auto font-medium text-slate-700">
                {new Date(role.createdDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiClock className="size-4 text-slate-400 shrink-0" />
              <span className="text-slate-500">Permissions</span>
              <span className="ml-auto font-medium text-slate-700">
                {totalPerms} permission{totalPerms !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiUsers className="size-4 text-slate-400 shrink-0" />
              <span className="text-slate-500">Assigned Admins</span>
              <span className="ml-auto font-medium text-slate-700">
                {role.adminCount} admin{role.adminCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Permission Modules Summary */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              Permission Modules
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <span
                  key={p.module}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                >
                  {p.module}
                  <span className="ml-1 text-slate-400">
                    ({p.actions.length})
                  </span>
                </span>
              ))}
              {role.permissions.length === 0 && (
                <span className="text-xs text-slate-400">No permissions assigned</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => onEdit(role)}
              className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FiEdit2 className="size-4 text-indigo-500" />
              Edit Role
            </button>
            <button
              onClick={() => onDuplicate(role)}
              className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FiCopy className="size-4 text-amber-500" />
              Duplicate Role
            </button>
            <button
              onClick={() => onDelete(role)}
              disabled={role.isSystemRole}
              className="w-full flex items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiTrash2 className="size-4" />
              {role.isSystemRole ? "Cannot Delete System Role" : "Delete Role"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

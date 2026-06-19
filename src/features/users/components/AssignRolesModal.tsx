"use client";

import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import type { User } from "@/types/user.types";

interface Props {
  user: User;
  allRoles: { id: string; name: string }[];
  onClose: () => void;
  onAssign: (roleIds: string[]) => void;
  onRemove: (roleIds: string[]) => void;
  isPending: boolean;
}

export default function AssignRolesModal({ user, allRoles, onClose, onAssign, onRemove, isPending }: Props) {
  const userRoleIds = user.roles.map((r) => r.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(userRoleIds);

  const toAdd = selectedIds.filter((id) => !userRoleIds.includes(id));
  const toRemove = userRoleIds.filter((id) => !selectedIds.includes(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-50">
            <FiUsers className="size-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Assign Roles</h2>
            <p className="text-xs text-slate-500">{user.name}</p>
          </div>
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-3">
          {allRoles.length === 0 && <p className="text-xs text-slate-400">No roles available.</p>}
          {allRoles.map((r) => {
            const isAssigned = userRoleIds.includes(r.id);
            return (
              <label key={r.id} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => {
                    setSelectedIds((prev) =>
                      prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                    );
                  }}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{r.name}</span>
                {isAssigned && <span className="text-[10px] text-slate-400 ml-auto">Currently assigned</span>}
              </label>
            );
          })}
        </div>

        {toAdd.length > 0 && (
          <p className="text-xs text-emerald-600 mt-2">{toAdd.length} role(s) will be added</p>
        )}
        {toRemove.length > 0 && (
          <p className="text-xs text-rose-600 mt-1">{toRemove.length} role(s) will be removed</p>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (toAdd.length > 0) onAssign(toAdd);
              if (toRemove.length > 0) onRemove(toRemove);
            }}
            disabled={(toAdd.length === 0 && toRemove.length === 0) || isPending}
            className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

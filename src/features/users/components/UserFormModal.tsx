"use client";

import React, { useState, useEffect } from "react";
import { FiUserPlus, FiEdit2 } from "react-icons/fi";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/user.types";

interface Props {
  mode: "create" | "edit";
  user?: User;
  roles: { id: string; name: string }[];
  onClose: () => void;
  onConfirm: (data: CreateUserRequest | UpdateUserRequest) => void;
  isPending: boolean;
}

export default function UserFormModal({ mode, user, roles, onClose, onConfirm, isPending }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (mode === "edit" && user) {
      setName(user.name);
      setEmail(user.email);
      setIsActive(user.isActive);
      setAvatar(user.avatar ?? "");
      setSelectedRoleIds(user.roles.map((r) => r.id));
    }
  }, [mode, user]);

  const handleSubmit = () => {
    if (mode === "create") {
      onConfirm({ name, email, password, roleIds: selectedRoleIds } as CreateUserRequest);
    } else {
      onConfirm({ name, email, isActive, avatar: avatar || undefined } as UpdateUserRequest);
    }
  };

  const canSubmit = name && email && (mode === "edit" || password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50">
            {mode === "create" ? <FiUserPlus className="size-5 text-indigo-600" /> : <FiEdit2 className="size-5 text-indigo-600" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{mode === "create" ? "Create User" : "Edit User"}</h2>
            <p className="text-xs text-slate-500">{mode === "create" ? "Add a new admin user" : `Editing ${user?.name}`}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          {mode === "create" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Strong password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}
          {mode === "edit" && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Avatar URL</label>
                <input
                  type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <span className={`inline-block size-4 rounded-full bg-white shadow transform transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-sm text-slate-700">{isActive ? "Active" : "Inactive"}</span>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Roles</label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-3">
              {roles.length === 0 && <p className="text-xs text-slate-400">No roles available.</p>}
              {roles.map((r) => (
                <label key={r.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(r.id)}
                    onChange={() => {
                      setSelectedRoleIds((prev) =>
                        prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                      );
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{r.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

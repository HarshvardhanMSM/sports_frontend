"use client";

import React from "react";
import { FiMail, FiCalendar, FiShield } from "react-icons/fi";
import type { User } from "@/types/user.types";

interface Props {
  user: User;
}

export default function UserDetailsCard({ user }: Props) {
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="size-16 rounded-full object-cover border-2 border-slate-200" />
          ) : (
            <div className="size-16 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700 shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
              <FiMail className="size-3.5" />
              {user.email}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <FiShield className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</p>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  Inactive
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="size-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <FiCalendar className="size-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Created</p>
              <p className="text-sm font-semibold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Assigned Roles</h3>
          {user.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.roles.map((r) => (
                <span key={r.id} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                  {r.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No roles assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

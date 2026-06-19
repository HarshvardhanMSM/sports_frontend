"use client";

import React from "react";
import { FiAlertCircle, FiUser, FiShield, FiKey } from "react-icons/fi";
import { useCurrentUser } from "@/hooks/useUsers";

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useCurrentUser();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const profile = !Array.isArray(raw) && raw && typeof raw === "object" && "id" in raw
    ? raw as { id: string; name: string; email: string; avatar?: string; roles: { id: string; name: string }[]; permissions: string[] }
    : null;

  const initials = profile
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Account</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">View your profile, roles, and permissions.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading profile...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load profile</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : !profile ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiUser className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Profile not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">Unable to load your profile information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 text-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="size-20 rounded-full object-cover border-2 border-slate-200 mx-auto" />
              ) : (
                <div className="size-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mx-auto">
                  {initials}
                </div>
              )}
              <h2 className="text-lg font-bold text-slate-800 mt-4">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Roles</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.roles.map((r) => (
                  <span key={r.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                    <FiShield className="size-3" />
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Permissions</h2>
              <p className="text-sm text-slate-500 mt-0.5">All permissions granted through your assigned roles.</p>
            </div>
            <div className="p-6">
              {profile.permissions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {profile.permissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                      <FiKey className="size-3.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">
                        {perm.split(".").map((p, i) => i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)).join(" — ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No permissions assigned.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

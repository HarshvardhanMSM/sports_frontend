"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle, FiUser } from "react-icons/fi";
import { useUser } from "@/hooks/useUsers";
import UserDetailsCard from "@/features/users/components/UserDetailsCard";
import type { User } from "@/types/user.types";

export default function UserDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data, isLoading, error, refetch } = useUser(id);

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const user = Array.isArray(raw) ? null : raw;

  const userName = user && typeof user === "object" && "name" in user
    ? (user as { name: string }).name
    : null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin-users"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {userName ?? "User Details"}
          </h1>
          <p className="text-sm text-slate-500">
            {isLoading ? "Loading..." : userName ?? "User not found"}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading user...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load user</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button onClick={() => refetch()} className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
            Retry
          </button>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiUser className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">User not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The user you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="max-w-2xl">
          <UserDetailsCard user={user as User} />
        </div>
      )}
    </div>
  );
}

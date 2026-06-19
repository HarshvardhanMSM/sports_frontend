"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  total: number;
  filtered: number;
}

export default function UserFilters({
  search, onSearchChange, statusFilter, onStatusFilterChange, total, filtered,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
      >
        <option value="All">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
        {filtered} of {total} users
      </span>
    </div>
  );
}

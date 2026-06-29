"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  total: number;
  filtered: number;
}

const statusOptions = [
  { value: "All", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

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
          onChange={(e) => {
            const clean = e.target.value.replace(/[^a-zA-Z0-9 @]/g, "");
            onSearchChange(clean);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <Select
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={statusOptions}
        className="max-w-[150px]"
      />
      <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
        {filtered} of {total} users
      </span>
    </div>
  );
}


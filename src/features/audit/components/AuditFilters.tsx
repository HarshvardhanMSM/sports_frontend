"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (v: string) => void;
  actionFilter: string;
  onActionFilterChange: (v: string) => void;
  total: number;
  filtered: number;
}

const MODULES = [
  "All Modules", "Catalog", "Inventory", "Orders", "Customers",
  "Marketing", "Content", "User Management", "Settings",
];

const ACTIONS = [
  "All Actions", "ORDER_CREATED", "PRODUCT_UPDATED", "TICKET_CREATED", "USER_LOGIN",
  "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT",
];

export default function AuditFilters({
  search, onSearchChange, moduleFilter, onModuleFilterChange,
  actionFilter, onActionFilterChange, total, filtered,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search by user, email, or entity ID..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <select
        value={moduleFilter}
        onChange={(e) => onModuleFilterChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
      >
        {MODULES.map((m) => <option key={m}>{m}</option>)}
      </select>
      <select
        value={actionFilter}
        onChange={(e) => onActionFilterChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
      >
        {ACTIONS.map((a) => <option key={a}>{a}</option>)}
      </select>
      <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
        {filtered} of {total} logs
      </span>
    </div>
  );
}

"use client";

import React from "react";
import { FiSearch } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

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

const moduleOptions = MODULES.map((m) => ({ value: m, label: m }));
const actionOptions = ACTIONS.map((a) => ({
  value: a,
  label: a === "All Actions" ? a : a.replace(/_/g, " "),
}));

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
      <Select
        value={moduleFilter}
        onChange={onModuleFilterChange}
        options={moduleOptions}
        className="min-w-[150px]"
      />
      <Select
        value={actionFilter}
        onChange={onActionFilterChange}
        options={actionOptions}
        className="min-w-[150px]"
      />
      <span className="text-xs text-slate-500 ml-auto whitespace-nowrap">
        {filtered} of {total} logs
      </span>
    </div>
  );
}


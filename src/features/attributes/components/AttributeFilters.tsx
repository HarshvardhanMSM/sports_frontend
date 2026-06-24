"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface AttributeFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  isFilterable: string;
  onFilterableChange: (v: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const filterableOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Filterable Only" },
  { value: "false", label: "Non-Filterable" },
];

export default function AttributeFilters({
  search,
  onSearchChange,
  isFilterable,
  onFilterableChange,
  onRefresh,
  isRefreshing,
}: AttributeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search attributes by name or slug..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Filterable:</span>
        <Select
          value={isFilterable}
          onChange={onFilterableChange}
          options={filterableOptions}
          className="min-w-[150px]"
        />
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors h-[34px] flex items-center justify-center cursor-pointer"
        >
          <FiRefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}


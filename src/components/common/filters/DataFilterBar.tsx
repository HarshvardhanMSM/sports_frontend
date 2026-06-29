"use client";

import React from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface FilterSelectConfig {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
  selectClassName?: string;
}

interface DataFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  selectFilters?: FilterSelectConfig[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DataFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  selectFilters,
  onRefresh,
  isRefreshing,
}: DataFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^a-zA-Z0-9 @]/g, "");
            onSearchChange(clean);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {selectFilters && selectFilters.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {selectFilters.map((filter) => (
            <div key={filter.label} className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
                {filter.label}:
              </span>
              <div className={filter.selectClassName ?? "min-w-[140px]"}>
                <Select
                  value={filter.value}
                  onChange={filter.onChange}
                  options={filter.options}
                />
              </div>
            </div>
          ))}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors h-[34px] flex items-center justify-center cursor-pointer"
            >
              <FiRefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
      )}
      {(!selectFilters || selectFilters.length === 0) && onRefresh && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors h-[34px] flex items-center justify-center cursor-pointer"
          >
            <FiRefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}

export default DataFilterBar;

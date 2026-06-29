"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { useCategories } from "@/hooks/useCategories";
import { useMemo } from "react";
import Select from "@/components/ui/select/Select";

interface SubCategoryFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  categoryId: string;
  onCategoryChange: (v: string) => void;
  isActive: string;
  onIsActiveChange: (v: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "true", label: "Active Only" },
  { value: "false", label: "Inactive Only" },
];

export default function SubCategoryFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  isActive,
  onIsActiveChange,
  onRefresh,
  isRefreshing,
}: SubCategoryFiltersProps) {
  const { data: catsData } = useCategories({ limit: 100 });
  const categories = useMemo(() => catsData?.data?.items ?? [], [catsData]);

  const categoryOptions = useMemo(() => {
    return [
      { value: "", label: "All Categories" },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];
  }, [categories]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search sub-categories by name, slug..."
          value={search}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^a-zA-Z0-9 @]/g, "");
            onSearchChange(clean);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Category:</span>
          <Select
            value={categoryId}
            onChange={onCategoryChange}
            options={categoryOptions}
            className="min-w-[160px]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Status:</span>
          <Select
            value={isActive}
            onChange={onIsActiveChange}
            options={statusOptions}
            className="min-w-[130px]"
          />
        </div>
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


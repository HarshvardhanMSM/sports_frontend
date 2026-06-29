"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface ReviewFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  ratingFilter: number | undefined;
  onRatingFilterChange: (value: number | undefined) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

const statusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "HIDDEN", label: "Hidden" },
];

const ratingOptions = [
  { value: "", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

export default function ReviewFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ratingFilter,
  onRatingFilterChange,
  onRefresh,
  isRefetching,
}: ReviewFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search by customer, product or review..."
          value={search}
          onChange={(e) => {
            const clean = e.target.value.replace(/[^a-zA-Z0-9 @]/g, "");
            onSearchChange(clean);
          }}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Status:</span>
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={statusOptions}
            className="min-w-[140px]"
          />
        </div> */}

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Rating:</span>
          <Select
            value={ratingFilter !== undefined ? String(ratingFilter) : ""}
            onChange={(val) => onRatingFilterChange(val ? Number(val) : undefined)}
            options={ratingOptions}
            className="min-w-[130px]"
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors h-[34px] flex items-center justify-center cursor-pointer"
          title="Refresh"
        >
          <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}


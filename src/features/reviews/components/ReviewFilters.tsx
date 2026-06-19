"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";

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
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="HIDDEN">Hidden</option>
        </select>

        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">Rating:</span>
        <select
          value={ratingFilter ?? ""}
          onChange={(e) => onRatingFilterChange(e.target.value ? Number(e.target.value) : undefined)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          title="Refresh"
        >
          <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

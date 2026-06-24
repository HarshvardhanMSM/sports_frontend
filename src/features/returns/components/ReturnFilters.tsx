"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Select from "@/components/ui/select/Select";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

const statusOptions = [
  { value: "All", label: "All Statuses" },
  { value: "REQUESTED", label: "Requested" },
  { value: "APPROVED", label: "Approved" },
  { value: "PICKUP_SCHEDULED", label: "Pickup Scheduled" },
  { value: "RECEIVED", label: "Received" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ReturnFilters({
  search, onSearchChange, statusFilter, onStatusFilterChange, onRefresh, isRefetching,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search by return ID, order, or customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={statusOptions}
          className="min-w-[170px]"
        />
        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors h-[34px] flex items-center justify-center cursor-pointer"
          title="Refresh"
        >
          <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}


"use client";

import { FiSearch, FiRefreshCw } from "react-icons/fi";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefetching: boolean;
}

export default function OrderFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefetching,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-white transition-all"
        >
          <option value="All">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RETURN_REQUESTED">Return Requested</option>
          <option value="RETURNED">Returned</option>
        </select>
        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 hover:bg-white disabled:opacity-50 transition-all"
          title="Refresh"
        >
          <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

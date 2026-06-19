"use client";

import React, { useState } from "react";
import {
  FiShoppingCart,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiEye,
  FiEdit2,
  FiFilter,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: string;
  paymentStatus: string;
}

const ORDERS: Order[] = [
  { id: "ORD-2026-0892", customer: "James Wilson", email: "james@email.com", date: "2026-06-15", items: 3, total: 390.0, status: "Pending", paymentStatus: "Paid" },
  { id: "ORD-2026-0891", customer: "Sarah Chen", email: "sarah@email.com", date: "2026-06-14", items: 1, total: 45.0, status: "Processing", paymentStatus: "Paid" },
  { id: "ORD-2026-0890", customer: "Marco Rossi", email: "marco@email.com", date: "2026-06-14", items: 2, total: 308.0, status: "Shipped", paymentStatus: "Paid" },
  { id: "ORD-2026-0889", customer: "Emily Davis", email: "emily@email.com", date: "2026-06-13", items: 4, total: 174.0, status: "Completed", paymentStatus: "Paid" },
  { id: "ORD-2026-0888", customer: "Tom Johnson", email: "tom@email.com", date: "2026-06-13", items: 2, total: 198.0, status: "Cancelled", paymentStatus: "Refunded" },
  { id: "ORD-2026-0887", customer: "Aisha Patel", email: "aisha@email.com", date: "2026-06-12", items: 1, total: 130.0, status: "Completed", paymentStatus: "Paid" },
  { id: "ORD-2026-0886", customer: "Carlos Mendez", email: "carlos@email.com", date: "2026-06-12", items: 5, total: 265.0, status: "Processing", paymentStatus: "Paid" },
  { id: "ORD-2026-0885", customer: "Rachel Kim", email: "rachel@email.com", date: "2026-06-11", items: 2, total: 220.0, status: "Shipped", paymentStatus: "Paid" },
  { id: "ORD-2026-0884", customer: "David Brown", email: "david@email.com", date: "2026-06-10", items: 1, total: 35.0, status: "Completed", paymentStatus: "Paid" },
  { id: "ORD-2026-0883", customer: "Lisa Zhang", email: "lisa@email.com", date: "2026-06-09", items: 3, total: 159.0, status: "Pending", paymentStatus: "Pending" },
];

const PAGE_SIZE = 5;

const ORDER_STATUS_CONFIG: Record<string, { cls: string; dot: string }> = {
  Completed: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Pending: { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  Processing: { cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500" },
  Shipped: { cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  Cancelled: { cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
};

const PAYMENT_STATUS_CONFIG: Record<string, { cls: string }> = {
  Paid: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  Pending: { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  Refunded: { cls: "bg-slate-100 text-slate-600 ring-1 ring-slate-200" },
};

function StatusBadge({ status, config }: { status: string; config: Record<string, { cls: string; dot?: string }> }) {
  const cfg = config[status] ?? { cls: "bg-slate-100 text-slate-600 ring-1 ring-slate-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {"dot" in cfg && cfg.dot && <span className={`size-1.5 rounded-full ${cfg.dot}`} />}
      {status}
    </span>
  );
}

const STAT_CARDS = [
  { label: "Total Orders", value: "1,250", sub: "All time", icon: FiShoppingCart, bg: "from-indigo-500 to-indigo-600" },
  { label: "Pending", value: "45", sub: "Awaiting processing", icon: FiClock, bg: "from-amber-500 to-amber-600" },
  { label: "Processing", value: "89", sub: "Being fulfilled", icon: FiRefreshCw, bg: "from-blue-500 to-blue-600" },
  { label: "Completed", value: "1,098", sub: "Successfully delivered", icon: FiCheckCircle, bg: "from-emerald-500 to-emerald-600" },
  { label: "Cancelled", value: "18", sub: "This month", icon: FiXCircle, bg: "from-rose-500 to-rose-600" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = ORDERS.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Order Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage all customer orders, statuses, and fulfillment.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="size-4 text-slate-400 shrink-0" />
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-white transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-600">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{order.customer}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{order.date}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {order.items}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">${order.total.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} config={ORDER_STATUS_CONFIG} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.paymentStatus} config={PAYMENT_STATUS_CONFIG} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 justify-end">
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <FiEye className="size-4" />
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <FiEdit2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FiShoppingCart className="size-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No orders found</p>
                        <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiDollarSign,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFilter,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  status: string;
  joined: string;
}

const CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "James Wilson", email: "james.wilson@email.com", phone: "+1 (555) 234-5678", location: "New York, US", orders: 12, totalSpent: 1380.0, status: "Active", joined: "2025-03-15" },
  { id: "cust-2", name: "Sarah Chen", email: "sarah.chen@email.com", phone: "+1 (555) 345-6789", location: "Los Angeles, US", orders: 8, totalSpent: 620.0, status: "Active", joined: "2025-04-22" },
  { id: "cust-3", name: "Marco Rossi", email: "marco.rossi@email.com", phone: "+39 02 1234567", location: "Milan, IT", orders: 5, totalSpent: 890.0, status: "Active", joined: "2025-06-10" },
  { id: "cust-4", name: "Emily Davis", email: "emily.davis@email.com", phone: "+1 (555) 456-7890", location: "Chicago, US", orders: 15, totalSpent: 2240.0, status: "Active", joined: "2024-11-08" },
  { id: "cust-5", name: "Tom Johnson", email: "tom.j@email.com", phone: "+1 (555) 567-8901", location: "Houston, US", orders: 3, totalSpent: 198.0, status: "Inactive", joined: "2025-09-30" },
  { id: "cust-6", name: "Aisha Patel", email: "aisha.patel@email.com", phone: "+44 20 7946 0958", location: "London, UK", orders: 20, totalSpent: 3450.0, status: "Active", joined: "2024-08-14" },
  { id: "cust-7", name: "Carlos Mendez", email: "c.mendez@email.com", phone: "+34 91 234 5678", location: "Madrid, ES", orders: 7, totalSpent: 530.0, status: "Active", joined: "2025-07-02" },
  { id: "cust-8", name: "Rachel Kim", email: "r.kim@email.com", phone: "+82 2 1234 5678", location: "Seoul, KR", orders: 11, totalSpent: 1560.0, status: "Active", joined: "2025-01-19" },
  { id: "cust-9", name: "David Brown", email: "d.brown@email.com", phone: "+1 (555) 678-9012", location: "Toronto, CA", orders: 4, totalSpent: 280.0, status: "Active", joined: "2025-10-05" },
  { id: "cust-10", name: "Lisa Zhang", email: "l.zhang@email.com", phone: "+86 10 1234 5678", location: "Beijing, CN", orders: 9, totalSpent: 945.0, status: "Inactive", joined: "2025-05-27" },
];

const PAGE_SIZE = 5;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

const STAT_CARDS = [
  { label: "Total Customers", value: "3,842", sub: "Registered accounts", icon: FiUsers, bg: "from-indigo-500 to-indigo-600" },
  { label: "Active", value: "2,956", sub: "Active in last 90 days", icon: FiUserCheck, bg: "from-emerald-500 to-emerald-600" },
  { label: "New This Month", value: "156", sub: "June 2026", icon: FiUserPlus, bg: "from-blue-500 to-blue-600" },
  { label: "Avg Order Value", value: "$116.54", sub: "Per order average", icon: FiDollarSign, bg: "from-violet-500 to-violet-600" },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = CUSTOMERS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || c.status === filter;
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
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Customer Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage your customer base, accounts, and purchase history.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
          <FiUserPlus className="size-4" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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
            placeholder="Search by name or email..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((c, i) => (
                <tr key={c.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-xs font-bold text-white shadow-sm`}>
                        {getInitials(c.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.phone}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.location}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {c.orders}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">${c.totalSpent.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                      c.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}>
                      <span className={`size-1.5 rounded-full ${c.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{c.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 justify-end">
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <FiEye className="size-4" />
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <FiEdit2 className="size-4" />
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <FiTrash2 className="size-4" />
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
                        <FiUsers className="size-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">No customers found</p>
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

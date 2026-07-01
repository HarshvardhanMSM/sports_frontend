"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { FiUsers, FiUserCheck, FiUserPlus, FiEye, FiHeart, FiAlertCircle } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useCustomers } from "@/hooks/useCustomers";
import type { Customer, CustomerListParams } from "@/types/customer.types";
import CustomerWishlistDrawer from "@/features/customers/components/CustomerWishlistDrawer";
import Pagination from "@/components/ui/pagination/Pagination";

function getInitials(first: string, last: string) {
  return (first[0] ?? "").toUpperCase() + (last[0] ?? "").toUpperCase();
}

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

export default function CustomersPage() {
  const router = useRouter();
  const { query, setQuery, debouncedQuery } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [isActive, setIsActive] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState("");
  const [page, setPage] = useState(1);
  const [wishlistTarget, setWishlistTarget] = useState<{ id: string; name: string; initialTab: "wishlist" | "cart" } | null>(null);

  const params: CustomerListParams = { page, limit: 10 };
  if (debouncedQuery) params.search = debouncedQuery;
  if (isActive) params.isActive = isActive === "true";
  if (isEmailVerified) params.isEmailVerified = isEmailVerified === "true";

  const { data, isLoading, error, refetch } = useCustomers(params);

  const allItems = data?.data?.customers ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  const isFiltered = !!debouncedQuery || isActive !== "" || isEmailVerified !== "";

  const columns: Column<Customer>[] = [
    { key: "id", header: "Customer ID", render: (c) => <span className="text-xs font-mono text-slate-500">{c.id.slice(0, 8)}...</span> },
    {
      key: "firstName", header: "First Name", render: (c) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${AVATAR_COLORS[0]} text-xs font-bold text-white shadow-sm`}>
            {getInitials(c.firstName, c.lastName)}
          </div>
          <button
            onClick={() => router.push(`/customers/${c.id}`)}
            className="text-sm font-semibold text-slate-800 hover:text-indigo-600 hover:underline transition-colors text-left cursor-pointer"
          >
            {c.firstName}
          </button>
        </div>
      ),
    },
    { key: "lastName", header: "Last Name", render: (c) => <span className="text-sm text-slate-700">{c.lastName}</span> },
    { key: "email", header: "Email", render: (c) => <span className="text-sm text-slate-600">{c.email}</span> },
    { key: "mobile", header: "Mobile", render: (c) => <span className="text-sm text-slate-600">{c.mobile ?? "-"}</span> },
    { key: "isEmailVerified", header: "Email Verified", render: (c) => <StatusBadge status={c.isEmailVerified ? "Yes" : "No"} /> },
    { key: "isActive", header: "Status", render: (c) => <StatusBadge status={c.isActive ? "Active" : "Inactive"} /> },
    { key: "createdAt", header: "Created Date", render: (c) => <span className="text-sm text-slate-600 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span> },
    {
      key: "actions", header: "Actions", headerClassName: "text-right", cellClassName: "px-6 py-4 whitespace-nowrap text-right", render: (c) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => router.push(`/customers/${c.id}`)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"><FiEye className="size-4" /></button>
          <button onClick={() => setWishlistTarget({ id: c.id, name: `${c.firstName} ${c.lastName}`, initialTab: "wishlist" })} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all" title="View Wishlist"><FiHeart className="size-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Customer Management"
        title="Customers"
        description="View and manage your customer base, accounts, and purchase history."
      />

      <StatsGrid className="grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Customers" value={data?.data?.totalCustomers ?? "-"} icon={FiUsers} color="indigo" />
        <StatCard label="Active Customers" value={data?.data?.activeCustomers ?? "-"} icon={FiUserCheck} color="emerald" />
        <StatCard label="Verified Customers" value={data?.data?.verifiedCustomers ?? "-"} icon={FiUsers} color="blue" />
        <StatCard label="New This Month" value={data?.data?.newThisMonth ?? "-"} icon={FiUserPlus} color="violet" />
        <StatCard label="New Today" value={data?.data?.newToday ?? "-"} icon={FiUserPlus} color="amber" />
      </StatsGrid>

      <DataFilterBar
        search={query}
        onSearchChange={(v) => { setQuery(v); setPage(1); }}
        searchPlaceholder="Search by name or email..."
        selectFilters={[
          { label: "Status", value: isActive, onChange: (v) => { setIsActive(v); setPage(1); }, options: [{ value: "", label: "All Statuses" }, { value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
          { label: "Verified", value: isEmailVerified, onChange: (v) => { setIsEmailVerified(v); setPage(1); }, options: [{ value: "", label: "All Verified" }, { value: "true", label: "Verified" }, { value: "false", label: "Unverified" }] },
        ]}
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load customers</p>
          <button onClick={() => refetch()} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading customers...</p>
        </div>
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="size-6 text-slate-400" />}
          title="No customers found"
          description={isFiltered ? "Try adjusting your search or filter criteria." : undefined}
        />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={allItems} keyExtractor={(c) => c.id} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />}
        </div>
      )}

      {wishlistTarget && (
        <CustomerWishlistDrawer
          customerId={wishlistTarget.id}
          customerName={wishlistTarget.name}
          initialTab={wishlistTarget.initialTab}
          onClose={() => setWishlistTarget(null)}
        />
      )}
    </div>
  );
}


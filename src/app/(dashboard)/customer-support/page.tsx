"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMessageCircle, FiCheckCircle, FiClock, FiThumbsUp, FiEye, FiAlertCircle } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import type { SupportTicket, SupportTicketListParams } from "@/types/support-ticket.types";
import Pagination from "@/components/ui/pagination/Pagination";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-orange-50 text-orange-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-600",
  ESCALATED: "bg-red-50 text-red-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

function formatStatus(status: string) {
  if (status === "IN_PROGRESS") return "In Progress";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function CustomerSupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const params: SupportTicketListParams = { page, limit: 10 };
  if (search) params.search = search;
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;

  const { data, isLoading, error, refetch } = useSupportTickets(params);

  const raw = data?.data;
  const isPaginated = raw != null && !Array.isArray(raw);
  const allItems = Array.isArray(raw) ? raw : (raw?.items ?? []);
  const total = isPaginated ? (raw?.total ?? 0) : allItems.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const isFiltered = search !== "" || statusFilter !== "" || priorityFilter !== "";

  const openCount = allItems.filter((t) => t.status === "OPEN").length;
  const inProgressCount = allItems.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = allItems.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

  const columns: Column<SupportTicket>[] = [
    { key: "ticketNumber", header: "Ticket #", render: (t) => <span className="text-sm font-mono font-semibold text-indigo-600">{t.ticketNumber}</span> },
    {
      key: "subject", header: "Subject", render: (t) => (
        <span className="text-sm text-slate-700 max-w-[200px] block truncate" title={t.subject}>
          {t.subject.length > 50 ? t.subject.slice(0, 50) + "\u2026" : t.subject}
        </span>
      ),
    },
    { key: "category", header: "Category", render: (t) => <span className="text-sm text-slate-600">{t.category}</span> },
    {
      key: "priority", header: "Priority", render: (t) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[t.priority] ?? "bg-slate-100 text-slate-600"}`}>
          {t.priority}
        </span>
      ),
    },
    {
      key: "status", header: "Status", render: (t) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[t.status] ?? "bg-slate-100 text-slate-600"}`}>
          {formatStatus(t.status)}
        </span>
      ),
    },
    {
      key: "customer", header: "Customer", render: (t) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">{t.customer ? `${t.customer.firstName} ${t.customer.lastName}` : t.customerName}</p>
          <p className="text-xs text-slate-400">{t.customer?.email ?? t.customerEmail}</p>
        </div>
      ),
    },
    { key: "assignedAdmin", header: "Assigned Admin", render: (t) => <span className="text-sm text-slate-700">{t.assignedAdminName ?? "Unassigned"}</span> },
    { key: "createdAt", header: "Created", render: (t) => <span className="text-sm text-slate-700 whitespace-nowrap">{new Date(t.createdAt).toLocaleDateString()}</span> },
    {
      key: "actions", header: "Actions", headerClassName: "text-right", cellClassName: "px-6 py-4 whitespace-nowrap text-right", render: (t) => (
        <button onClick={() => router.push(`/customer-support/${t.id}`)} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <FiEye className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Support" description="Manage support tickets, track resolutions, and ensure customer satisfaction." />

      <StatsGrid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Tickets" value={openCount} icon={FiMessageCircle} color="indigo" sub="Awaiting response" variant="simple" />
        <StatCard label="In Progress" value={inProgressCount} icon={FiCheckCircle} color="emerald" sub="Being worked on" variant="simple" />
        <StatCard label="Total Tickets" value={total} icon={FiClock} color="blue" sub="All tickets" variant="simple" />
        <StatCard label="Resolved / Closed" value={resolvedCount} icon={FiThumbsUp} color="violet" sub="Completed tickets" variant="simple" />
      </StatsGrid>

      <DataFilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by ticket ID, customer, or subject..."
        selectFilters={[
          { label: "Status", value: statusFilter, onChange: (v) => { setStatusFilter(v); setPage(1); }, options: [{ value: "", label: "All Statuses" }, { value: "OPEN", label: "Open" }, { value: "IN_PROGRESS", label: "In Progress" }, { value: "RESOLVED", label: "Resolved" }, { value: "CLOSED", label: "Closed" }, { value: "ESCALATED", label: "Escalated" }] },
          { label: "Priority", value: priorityFilter, onChange: (v) => { setPriorityFilter(v); setPage(1); }, options: [{ value: "", label: "All Priorities" }, { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }, { value: "URGENT", label: "Urgent" }] },
        ]}
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load tickets</p>
          <button onClick={() => refetch()} className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading tickets...</p>
        </div>
      ) : allItems.length === 0 ? (
        <EmptyState
          icon={<FiMessageCircle className="size-6 text-slate-400" />}
          title="No tickets found"
          description={isFiltered ? "Try adjusting your search or filter criteria." : undefined}
        />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} data={allItems} keyExtractor={(t) => t.id} />
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} total={total} limit={10} onPageChange={setPage} />}
        </div>
      )}
    </div>
  );
}

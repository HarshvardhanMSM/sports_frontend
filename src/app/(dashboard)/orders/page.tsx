"use client";

import React, { useState } from "react";
import {
  FiShoppingCart,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useOrders, useUpdateOrderStatus, useCancelOrder } from "@/hooks/useOrders";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { OrderListParams, OrderListItem, OrderStatus } from "@/types/order.types";
import OrdersTable from "@/features/orders/components/OrdersTable";
import UpdateStatusModal from "@/features/orders/components/UpdateStatusModal";
import CancelOrderModal from "@/features/orders/components/CancelOrderModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function OrdersPage() {
  const { query: searchTerm, setQuery: setSearchTerm, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState<OrderListItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderListItem | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const params: OrderListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    ...(statusFilter !== "All" ? { status: statusFilter as OrderStatus } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useOrders(params);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const d = data?.data;
  const items = d?.items ?? [];
  const total = d?.meta?.total ?? 0;
  const totalPages = d?.meta?.totalPages ?? 1;
  const limit = d?.meta?.limit ?? 10;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!statusTarget) return;
    try {
      await updateStatus({ id: statusTarget.id, status: newStatus });
      showToast("success", `Order status updated to ${newStatus.replace(/_/g, " ")}`);
      setStatusTarget(null);
    } catch {
      showToast("error", "Failed to update status");
    }
  };

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return;
    try {
      await cancelOrder({ id: cancelTarget.id, reason });
      showToast("success", "Order cancelled successfully");
      setCancelTarget(null);
    } catch {
      showToast("error", "Failed to cancel order");
    }
  };

  const pendingCount = d?.pending ?? 0;
  const processingCount = d?.processing ?? 0;
  const shippedCount = d?.shipped ?? 0;
  const deliveredCount = d?.delivered ?? 0;
  const cancelledCount = d?.cancelled ?? 0;

  const isFiltered = searchTerm !== "" || statusFilter !== "All";

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <PageHeader
        badge="Order Management"
        title="Orders"
        description="View and manage all customer orders, statuses, and fulfillment."
      />

      <StatsGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Orders" value={isLoading ? 0 : (d?.totalOrders ?? 0)} icon={FiShoppingCart} color="indigo" sub="All time" />
        <StatCard label="Pending" value={pendingCount} icon={FiClock} color="amber" sub="Awaiting processing" />
        <StatCard label="Processing" value={processingCount} icon={FiRefreshCw} color="blue" sub="Being fulfilled" />
        <StatCard label="Shipped" value={shippedCount} icon={FiTruck} color="cyan" sub="In transit" />
        <StatCard label="Delivered" value={deliveredCount} icon={FiCheckCircle} color="emerald" sub="Successfully delivered" />
        <StatCard label="Cancelled" value={cancelledCount} icon={FiXCircle} color="rose" sub="This period" />
      </StatsGrid>

      <DataFilterBar
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        searchPlaceholder="Search orders by ID, customer, or email..."
        selectFilters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
            options: [
              { value: "All", label: "All Statuses" },
              { value: "PENDING", label: "Pending" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "PROCESSING", label: "Processing" },
              { value: "PACKED", label: "Packed" },
              { value: "SHIPPED", label: "Shipped" },
              { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
              { value: "DELIVERED", label: "Delivered" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
          },
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load orders</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <OrdersTable
            orders={items}
            onStatusUpdate={setStatusTarget}
            onCancel={setCancelTarget}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={<FiPackage className="size-6 text-slate-400" />}
          title={isFiltered ? "No matching orders" : "No orders found"}
          description={isFiltered
            ? "No orders match your current filters. Try refining your search query."
            : "Orders will appear here once customers start placing them."}
        />
      )}

      {statusTarget && (
        <UpdateStatusModal
          currentStatus={statusTarget.status}
          onClose={() => setStatusTarget(null)}
          onConfirm={handleStatusUpdate}
          isPending={isUpdating}
        />
      )}

      {cancelTarget && (
        <CancelOrderModal
          orderNumber={cancelTarget.orderNumber}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancel}
          isPending={isCancelling}
        />
      )}
    </div>
  );
}

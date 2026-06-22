"use client";

import React, { useState, useEffect } from "react";
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
import { useOrders, useUpdateOrderStatus, useCancelOrder } from "@/hooks/useOrders";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { OrderListParams, OrderListItem, OrderStatus } from "@/types/order.types";
import OrdersTable from "@/features/orders/components/OrdersTable";
import OrderFilters from "@/features/orders/components/OrderFilters";
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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error, isRefetching, refetch } = useOrders(params);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const items = data?.data?.items ?? [];
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const limit = data?.data?.meta?.limit ?? 10;

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

  const pendingCount = items.filter((o) => o.status === "PENDING").length;
  const processingCount = items.filter((o) => o.status === "PROCESSING" || o.status === "CONFIRMED" || o.status === "PACKED").length;
  const shippedCount = items.filter((o) => o.status === "SHIPPED" || o.status === "OUT_FOR_DELIVERY").length;
  const deliveredCount = items.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = items.filter((o) => o.status === "CANCELLED").length;

  const STAT_CARDS = [
    { label: "Total Orders", value: total, sub: "All time", icon: FiShoppingCart, bg: "from-indigo-500 to-indigo-600" },
    { label: "Pending", value: pendingCount, sub: "Awaiting processing", icon: FiClock, bg: "from-amber-500 to-amber-600" },
    { label: "Processing", value: processingCount, sub: "Being fulfilled", icon: FiRefreshCw, bg: "from-blue-500 to-blue-600" },
    { label: "Shipped", value: shippedCount, sub: "In transit", icon: FiTruck, bg: "from-cyan-500 to-cyan-600" },
    { label: "Delivered", value: deliveredCount, sub: "Successfully delivered", icon: FiCheckCircle, bg: "from-emerald-500 to-emerald-600" },
    { label: "Cancelled", value: cancelledCount, sub: "This period", icon: FiXCircle, bg: "from-rose-500 to-rose-600" },
  ];

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{isLoading ? "-" : value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <OrderFilters
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiPackage className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== "All" ? "No matching orders" : "No orders found"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {searchTerm || statusFilter !== "All"
              ? "No orders match your current filters. Try refining your search query."
              : "Orders will appear here once customers start placing them."}
          </p>
        </div>
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

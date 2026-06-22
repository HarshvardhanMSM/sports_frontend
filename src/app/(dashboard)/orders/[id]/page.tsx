"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useOrder, useUpdateOrderStatus, useCancelOrder } from "@/hooks/useOrders";
import { useToast } from "@/components/common/Toast/useToast";
import type { OrderStatus } from "@/types/order.types";
import OrderDetailsCard from "@/features/orders/components/OrderDetailsCard";
import OrderItemsTable from "@/features/orders/components/OrderItemsTable";
import PriceBreakdownCard from "@/features/orders/components/PriceBreakdownCard";
import UpdateStatusModal from "@/features/orders/components/UpdateStatusModal";
import CancelOrderModal from "@/features/orders/components/CancelOrderModal";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error, refetch } = useOrder(id);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutateAsync: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const toast = useToast();

  const order = data?.data;

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!id) return;
    try {
      await updateStatus({ id, status: newStatus });
      toast.success(`Order status updated to ${newStatus.replace(/_/g, " ")}`);
      setShowStatusModal(false);
    } catch {
      // onError in useUpdateOrderStatus handles toast
    }
  };

  const handleCancel = async (reason: string) => {
    if (!id) return;
    try {
      await cancelOrder({ id, reason });
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
    } catch {
      // onError in useCancelOrder handles toast
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FiArrowLeft className="size-4" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Details</h1>
            <p className="text-sm text-slate-500">
              {isLoading ? "Loading..." : order ? order.orderNumber : "Not found"}
            </p>
          </div>
        </div>
        {order && (
          <div className="flex gap-2">
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
              >
                Update Status
              </button>
            )}
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
              >
                Cancel Order
              </button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading order...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load order</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : !order ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Order not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The order you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderDetailsCard order={order} />
            <OrderItemsTable items={order.items} />
          </div>
          <div>
            <PriceBreakdownCard
              subtotal={order.subtotal}
              discountAmount={order.discountAmount}
              shippingAmount={order.shippingAmount}
              deliveryCharge={order.deliveryCharge}
              codCharge={order.codCharge}
              handlingCharge={order.handlingCharge}
              taxAmount={order.taxAmount}
              totalAmount={order.totalAmount}
            />
          </div>
        </div>
      )}

      {showStatusModal && order && (
        <UpdateStatusModal
          currentStatus={order.status}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusUpdate}
          isPending={isUpdating}
        />
      )}

      {showCancelModal && order && (
        <CancelOrderModal
          orderNumber={order.orderNumber}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
          isPending={isCancelling}
        />
      )}
    </div>
  );
}

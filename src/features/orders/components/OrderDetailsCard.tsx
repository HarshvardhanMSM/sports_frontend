"use client";

import React from "react";
import { FiCalendar, FiClock, FiUser, FiMapPin } from "react-icons/fi";
import type { OrderDetail } from "@/types/order.types";

interface OrderDetailsCardProps {
  order: OrderDetail;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:           "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  CONFIRMED:         "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  PROCESSING:        "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  PACKED:            "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  SHIPPED:           "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  OUT_FOR_DELIVERY:  "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  DELIVERED:         "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  CANCELLED:         "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  RETURN_REQUESTED:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  RETURNED:          "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  return (
    <div className="space-y-6">
      {/* Order Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Order Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Order Number</p>
            <p className="text-sm font-mono font-bold text-indigo-600">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</p>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] ?? ""}`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Created</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiCalendar className="size-3.5 text-slate-400" />
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Updated</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiClock className="size-3.5 text-slate-400" />
              <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Customer Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Customer ID</p>
            <p className="text-sm font-mono text-slate-700">{order.userId}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Name</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiUser className="size-3.5 text-slate-400" />
              <span>{order.userName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {order.shippingAddress && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Shipping Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Address</p>
              <div className="flex gap-1.5 text-sm text-slate-700">
                <FiMapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
            {order.warehouse && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Warehouse</p>
                <p className="text-sm font-semibold text-slate-700">{order.warehouse.name}</p>
                <p className="text-xs text-slate-500">{order.warehouse.location}</p>
              </div>
            )}
            {order.distanceKm !== undefined && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Distance</p>
                <p className="text-sm font-semibold text-slate-700">{order.distanceKm} km</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

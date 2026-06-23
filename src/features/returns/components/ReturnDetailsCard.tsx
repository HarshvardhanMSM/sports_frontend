"use client";

import React from "react";
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiPackage, FiShoppingCart, FiMessageSquare, FiTruck } from "react-icons/fi";
import type { ReturnListItem } from "@/types/return.types";
import { resolveImageUrl } from "@/lib/image";

interface Props {
  data: ReturnListItem;
}

export default function ReturnDetailsCard({ data }: Props) {
  // const firstItem = data.items?.[0];

  return (
    <div className="space-y-6">
      {/* Section 1: Return Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Return Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Return ID</p>
            <p className="text-sm font-mono font-bold text-indigo-600">{data.returnNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Status</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
              {data.status?.replace(/_/g, " ") ?? "Unknown"}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Requested</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiCalendar className="size-3.5 text-slate-400" />
              <span>{data.requestedAt ? new Date(data.requestedAt).toLocaleDateString() : "-"}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Updated</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiClock className="size-3.5 text-slate-400" />
              <span>{data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Customer Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Customer Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.customer && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Name</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <FiUser className="size-3.5 text-slate-400" />
                  <span className="font-semibold">{data.customer.firstName ?? ""} {data.customer.lastName ?? ""}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <FiMail className="size-3.5 text-slate-400" />
                  <span>{data.customer.email ?? "-"}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Mobile</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <FiPhone className="size-3.5 text-slate-400" />
                  <span>{data.customer.mobile ?? "-"}</span>
                </div>
              </div>
            </>
          )}
          {!data.customer && (
            <p className="text-sm text-slate-400 col-span-3">No customer information available.</p>
          )}
        </div>
      </div>

      {/* Section 3: Order Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Order Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Order Number</p>
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <FiShoppingCart className="size-3.5 text-slate-400" />
              <span className="font-mono font-semibold text-indigo-600">{data.order?.orderNumber ?? "-"}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Order Date</p>
            <p className="text-sm text-slate-700">{data.order?.createdAt ? new Date(data.order.createdAt).toLocaleDateString() : "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Order Value</p>
            <p className="text-sm font-bold text-slate-800">${Number(data.order?.totalAmount ?? 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Section 4: Product Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Product Information</h2>
        </div>
        <div className="p-6 space-y-4">
          {data.items && data.items.length > 0 ? data.items.map((item) => {
            const p = item.product;
            return (
              <div key={item.id} className="flex items-center gap-4">
                {p?.productImage ? (
                  <img src={resolveImageUrl(p.productImage)} alt={p.productName ?? ""} className="size-16 rounded-xl object-cover border border-slate-200" />
                ) : (
                  <div className="size-16 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">
                    <FiPackage className="size-6" />
                  </div>
                )}
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-bold text-slate-800">{p?.productName ?? "Unknown"}</p>
                  <p className="text-xs font-mono text-slate-500">{p?.sku ?? "-"}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Qty: {item.quantity ?? 0}</span>
                    <span>Condition: {item.condition ?? "-"}</span>
                    <span>Unit: ${Number(p?.unitPrice ?? 0).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">${Number(item.refundAmount ?? 0).toFixed(2)}</p>
              </div>
            );
          }) : (
            <p className="text-sm text-slate-400">No product information available.</p>
          )}
        </div>
      </div>

      {/* Section 5: Return Reason */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Return Reason</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Reason</p>
            <p className="text-sm font-semibold text-slate-700">{data.reason ? data.reason.replace(/_/g, " ") : "-"}</p>
          </div>
          {data.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Customer Comment</p>
              <div className="flex gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-4">
                <FiMessageSquare className="size-4 text-slate-400 mt-0.5 shrink-0" />
                <p>{data.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 6: Refund & Shipment */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Refund & Shipment</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Refund</p>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Total Refund Amount</p>
              <p className="text-lg font-bold text-slate-900">${Number(data.totalRefundAmount ?? 0).toFixed(2)}</p>
            </div>
            {data.approvedAt && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Approved At</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <FiCalendar className="size-3.5 text-slate-400" />
                  <span>{new Date(data.approvedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            {data.completedAt && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Completed At</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <FiCalendar className="size-3.5 text-slate-400" />
                  <span>{new Date(data.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
          {data.shipment && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shipment</p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiTruck className="size-3.5 text-slate-400" />
                <span className="font-semibold">{data.shipment.courierName ?? "-"}</span>
              </div>
              <p className="text-xs text-slate-500">Tracking: {data.shipment.trackingNumber ?? "-"}</p>
              <p className="text-xs text-slate-500">Status: {data.shipment.status ? data.shipment.status.replace(/_/g, " ") : "-"}</p>
              {data.shipment.pickupDate && (
                <p className="text-xs text-slate-500">Pickup: {new Date(data.shipment.pickupDate).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

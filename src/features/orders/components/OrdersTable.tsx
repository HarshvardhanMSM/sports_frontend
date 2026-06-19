"use client";

import React from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import type { OrderListItem } from "@/types/order.types";

interface OrdersTableProps {
  orders: OrderListItem[];
  onStatusUpdate: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  PENDING:           { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  CONFIRMED:         { bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500" },
  PROCESSING:        { bg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  PACKED:            { bg: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  SHIPPED:           { bg: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200", dot: "bg-cyan-500" },
  OUT_FOR_DELIVERY:  { bg: "bg-orange-50 text-orange-700 ring-1 ring-orange-200", dot: "bg-orange-500" },
  DELIVERED:         { bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:         { bg: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
  RETURN_REQUESTED:  { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  RETURNED:          { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" },
};

const PAYMENT_STYLES: Record<string, string> = {
  PAID:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  PENDING:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  REFUNDED: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  FAILED:   "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

function Badge({ status, styles }: { status: string; styles: Record<string, { bg: string; dot: string }> }) {
  const s = styles[status] ?? { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const cls = PAYMENT_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

export default function OrdersTable({ orders, onStatusUpdate, onCancel }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/orders/${order.id}`} className="text-sm font-mono font-semibold text-indigo-600 hover:text-indigo-800">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-800">{order.userName}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {order.items.length > 0 && (
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          item.imageUrl ? (
                            <img
                              key={i}
                              src={item.imageUrl}
                              alt=""
                              className="size-7 rounded-lg border-2 border-white object-cover"
                            />
                          ) : (
                            <div
                              key={i}
                              className="size-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500"
                            >
                              {item.productName.charAt(0)}
                            </div>
                          )
                        ))}
                        {order.items.length > 3 && (
                          <div className="size-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <span className="inline-flex items-center justify-center size-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                      {order.items.length}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">
                  ${Number(order.totalAmount).toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <Badge status={order.status} styles={STATUS_STYLES} />
                </td>
                <td className="px-5 py-4">
                  <PaymentBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 justify-end">
                    <Link
                      href={`/orders/${order.id}`}
                      className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="View"
                    >
                      <FiEye className="size-4" />
                    </Link>
                    <button
                      onClick={() => onStatusUpdate(order)}
                      className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-semibold"
                      title="Update Status"
                    >
                      <span className="text-[10px] font-bold">S</span>
                    </button>
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <button
                        onClick={() => onCancel(order)}
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs font-semibold"
                        title="Cancel"
                      >
                        <span className="text-[10px] font-bold">X</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <span className="text-2xl text-slate-400">0</span>
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
  );
}

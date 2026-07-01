"use client";

import React from "react";
import { FiPackage, FiClock, FiMapPin, FiUser, FiDollarSign } from "react-icons/fi";
import type { Shipment } from "@/types/shipment.types";

interface Props {
  data: Shipment;
}

export default function ShipmentDetailsCard({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Shipment Information</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <FiPackage className="size-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tracking Number</p>
              <p className="text-sm font-mono font-bold text-slate-800">{data.trackingNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shipment ID</p>
              <p className="text-sm font-mono text-slate-700">{data.id}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Created</p>
              <p className="text-sm text-slate-700">{new Date(data.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <FiClock className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Updated</p>
              <p className="text-sm text-slate-700">{new Date(data.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="border-t border-slate-100">
        <div className="px-6 py-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Order Information</h3>
          {data.order ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <FiPackage className="size-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Order ID</p>
                  <p className="text-sm font-mono font-semibold text-indigo-600">{data.order.orderNumber}</p>
                </div>
              </div>
              {data.order.customerName && (
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <FiUser className="size-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer</p>
                    <p className="text-sm font-semibold text-slate-700">{data.order.customerName}</p>
                  </div>
                </div>
              )}
              {data.order.totalAmount && (
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <FiDollarSign className="size-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount</p>
                    <p className="text-sm font-bold text-slate-700">${Number(data.order.totalAmount).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No order information available.</p>
          )}
        </div>
      </div>

      {/* Warehouse Information */}
      {/* <div className="border-t border-slate-100">
        <div className="px-6 py-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Warehouse Information</h3>
          {data.warehouse ? (
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <FiMapPin className="size-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Warehouse</p>
                <p className="text-sm font-semibold text-slate-700">{data.warehouse.name}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No warehouse information available.</p>
          )}
        </div>
      </div> */}
    </div>
  );
}

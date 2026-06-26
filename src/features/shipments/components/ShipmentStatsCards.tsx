"use client";

import React from "react";
import { FiPackage, FiClock, FiBox, FiTruck, FiNavigation, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import type { ShipmentMetrics } from "@/types/shipment.types";

const CARDS: {
  label: string;
  key: keyof ShipmentMetrics;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}[] = [
  { label: "Pending",          key: "failedDelivery", icon: <FiClock className="size-5" />,        iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "Packed",           key: "packed",         icon: <FiBox className="size-5" />,           iconBg: "bg-blue-50",  iconColor: "text-blue-600" },
  { label: "Ready For Dispatch", key: "dispatched",   icon: <FiPackage className="size-5" />,       iconBg: "bg-violet-50",iconColor: "text-violet-600" },
  { label: "Out For Delivery", key: "inTransit",      icon: <FiTruck className="size-5" />,         iconBg: "bg-orange-50",iconColor: "text-orange-600" },
  { label: "Delivered",        key: "delivered",      icon: <FiCheckCircle className="size-5" />,    iconBg: "bg-emerald-50",iconColor: "text-emerald-600" },
  { label: "Failed",           key: "failed",         icon: <FiAlertCircle className="size-5" />,    iconBg: "bg-rose-50",   iconColor: "text-rose-600" },
];

export default function ShipmentStatsCards(metrics: ShipmentMetrics) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <FiNavigation className="size-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Shipments</p>
          <p className="text-2xl font-bold text-slate-800">{metrics.totalShipments}</p>
        </div>
      </div>

      {CARDS.map((c) => (
        <div key={c.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
            <span className={c.iconColor}>{c.icon}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
            <p className="text-2xl font-bold text-slate-800">{metrics[c.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

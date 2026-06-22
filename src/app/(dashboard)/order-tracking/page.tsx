"use client";

import React, { useState, useEffect } from "react";
import {
  FiNavigation,
  FiClock,
  FiTrendingUp,
  FiSearch,
  FiTruck,
} from "react-icons/fi";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";

interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingNo: string;
  destination: string;
  estimatedDelivery: string;
  status: string;
  lastUpdate: string;
}

const SHIPMENTS: Shipment[] = [
  { id: "SHP-0045", orderId: "ORD-2026-0890", customer: "Marco Rossi", carrier: "TCS Courier", trackingNo: "TCS-2026-78932", destination: "Lahore", estimatedDelivery: "2026-06-17", status: "In Transit", lastUpdate: "2026-06-16 10:22" },
  { id: "SHP-0044", orderId: "ORD-2026-0885", customer: "Rachel Kim", carrier: "Leopard Courier", trackingNo: "LPD-2026-65421", destination: "Islamabad", estimatedDelivery: "2026-06-16", status: "Out for Delivery", lastUpdate: "2026-06-16 08:45" },
  { id: "SHP-0043", orderId: "ORD-2026-0889", customer: "Emily Davis", carrier: "M&P Express", trackingNo: "MNP-2026-54321", destination: "Karachi", estimatedDelivery: "2026-06-15", status: "Delivered", lastUpdate: "2026-06-15 14:33" },
  { id: "SHP-0042", orderId: "ORD-2026-0887", customer: "Aisha Patel", carrier: "TCS Courier", trackingNo: "TCS-2026-78456", destination: "Faisalabad", estimatedDelivery: "2026-06-14", status: "Delivered", lastUpdate: "2026-06-14 11:10" },
  { id: "SHP-0041", orderId: "ORD-2026-0884", customer: "David Brown", carrier: "Leopard Courier", trackingNo: "LPD-2026-65000", destination: "Multan", estimatedDelivery: "2026-06-13", status: "Delivered", lastUpdate: "2026-06-13 16:55" },
  { id: "SHP-0040", orderId: "ORD-2026-0881", customer: "Ali Hassan", carrier: "DHL Pakistan", trackingNo: "DHL-2026-1234PK", destination: "Quetta", estimatedDelivery: "2026-06-18", status: "In Transit", lastUpdate: "2026-06-16 07:30" },
  { id: "SHP-0039", orderId: "ORD-2026-0879", customer: "Fatima Noor", carrier: "M&P Express", trackingNo: "MNP-2026-54100", destination: "Peshawar", estimatedDelivery: "2026-06-16", status: "In Transit", lastUpdate: "2026-06-15 22:15" },
  { id: "SHP-0038", orderId: "ORD-2026-0876", customer: "Bilal Ahmed", carrier: "TCS Courier", trackingNo: "TCS-2026-77890", destination: "Hyderabad", estimatedDelivery: "2026-06-14", status: "Failed", lastUpdate: "2026-06-14 09:00" },
  { id: "SHP-0037", orderId: "ORD-2026-0873", customer: "Zara Sheikh", carrier: "Leopard Courier", trackingNo: "LPD-2026-64800", destination: "Sialkot", estimatedDelivery: "2026-06-13", status: "Delivered", lastUpdate: "2026-06-13 13:42" },
  { id: "SHP-0036", orderId: "ORD-2026-0870", customer: "Hassan Ali", carrier: "DHL Pakistan", trackingNo: "DHL-2026-1233PK", destination: "Rawalpindi", estimatedDelivery: "2026-06-15", status: "Delivered", lastUpdate: "2026-06-15 10:18" },
];

function statusBadge(status: string) {
  switch (status) {
    case "In Transit":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700";
    case "Out for Delivery":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700";
    case "Delivered":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
    case "Failed":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
  }
}

export default function OrderTrackingPage() {
  const { query: trackSearch, setQuery: setTrackSearch, results: filtered } = useFuzzySearch(SHIPMENTS, {
    keys: ["orderId", "trackingNo", "customer"],
    isServerSide: false,
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Order Tracking</h1>
          <p className="text-sm text-slate-500">Search and track individual orders through their fulfillment journey.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiNavigation className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Orders Tracked Today</p>
            <p className="text-2xl font-bold text-slate-800">89</p>
            <p className="text-xs text-slate-500 mt-0.5">Tracking queries today</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiClock className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Delivery Time</p>
            <p className="text-2xl font-bold text-slate-800">2.8 days</p>
            <p className="text-xs text-slate-500 mt-0.5">Average across carriers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiTrendingUp className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">On-Time Delivery Rate</p>
            <p className="text-2xl font-bold text-slate-800">94.2%</p>
            <p className="text-xs text-slate-500 mt-0.5">This month</p>
          </div>
        </div>
      </div>

      {/* Track an Order Search Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-1">Track an Order</h2>
        <p className="text-sm text-slate-500 mb-4">Enter an order ID or tracking number to view real-time status.</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="e.g. ORD-2026-0890 or TCS-2026-78932..."
              value={trackSearch}
              onChange={(e) => setTrackSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            Track
          </button>
        </div>
      </div>

      {/* Recent Trackings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">Recent Trackings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {trackSearch.trim() ? `Showing results for "${trackSearch}"` : "Latest shipment activity"}
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking #</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-mono font-semibold text-indigo-600">{s.orderId}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{s.customer}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <FiTruck className="size-3.5 text-slate-400 shrink-0" />
                    {s.carrier}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-mono text-slate-600">{s.trackingNo}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(s.status)}>{s.status}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{s.estimatedDelivery}</td>
                <td className="px-4 py-4 text-sm text-slate-500">{s.lastUpdate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                  No shipments found for &quot;{trackSearch}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delivery Performance */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Delivery Performance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">On Time</p>
            <p className="text-3xl font-bold text-emerald-700">94.2%</p>
            <p className="text-xs text-emerald-600 mt-1">Delivered within SLA</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">Late</p>
            <p className="text-3xl font-bold text-amber-700">4.1%</p>
            <p className="text-xs text-amber-600 mt-1">Delayed beyond SLA</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-100 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-700">1.7%</p>
            <p className="text-xs text-red-600 mt-1">Undeliverable / returned</p>
          </div>
        </div>
      </div>
    </div>
  );
}

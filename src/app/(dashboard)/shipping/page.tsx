"use client";

import React, { useState, useMemo } from "react";
import {
  FiTruck,
  FiNavigation,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiEye,
  FiEdit2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";

interface Shipment {
  id: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingNo: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  status: string;
}

const SHIPMENTS: Shipment[] = [
  { id: "SHP-0045", orderId: "ORD-2026-0890", customer: "Marco Rossi", carrier: "TCS Courier", trackingNo: "TCS-2026-78932", origin: "Karachi Warehouse", destination: "Lahore", estimatedDelivery: "2026-06-17", status: "In Transit" },
  { id: "SHP-0044", orderId: "ORD-2026-0885", customer: "Rachel Kim", carrier: "Leopard Courier", trackingNo: "LPD-2026-65421", origin: "Lahore Hub", destination: "Islamabad", estimatedDelivery: "2026-06-16", status: "Out for Delivery" },
  { id: "SHP-0043", orderId: "ORD-2026-0889", customer: "Emily Davis", carrier: "M&P Express", trackingNo: "MNP-2026-54321", origin: "Karachi Warehouse", destination: "Karachi", estimatedDelivery: "2026-06-15", status: "Delivered" },
  { id: "SHP-0042", orderId: "ORD-2026-0887", customer: "Aisha Patel", carrier: "TCS Courier", trackingNo: "TCS-2026-78456", origin: "Karachi Warehouse", destination: "Faisalabad", estimatedDelivery: "2026-06-14", status: "Delivered" },
  { id: "SHP-0041", orderId: "ORD-2026-0884", customer: "David Brown", carrier: "Leopard Courier", trackingNo: "LPD-2026-65000", origin: "Lahore Hub", destination: "Multan", estimatedDelivery: "2026-06-13", status: "Delivered" },
  { id: "SHP-0040", orderId: "ORD-2026-0881", customer: "Ali Hassan", carrier: "DHL Pakistan", trackingNo: "DHL-2026-1234PK", origin: "Karachi Warehouse", destination: "Quetta", estimatedDelivery: "2026-06-18", status: "In Transit" },
  { id: "SHP-0039", orderId: "ORD-2026-0879", customer: "Fatima Noor", carrier: "M&P Express", trackingNo: "MNP-2026-54100", origin: "Karachi Warehouse", destination: "Peshawar", estimatedDelivery: "2026-06-16", status: "In Transit" },
  { id: "SHP-0038", orderId: "ORD-2026-0876", customer: "Bilal Ahmed", carrier: "TCS Courier", trackingNo: "TCS-2026-77890", origin: "Karachi Warehouse", destination: "Hyderabad", estimatedDelivery: "2026-06-14", status: "Failed" },
  { id: "SHP-0037", orderId: "ORD-2026-0873", customer: "Zara Sheikh", carrier: "Leopard Courier", trackingNo: "LPD-2026-64800", origin: "Lahore Hub", destination: "Sialkot", estimatedDelivery: "2026-06-13", status: "Delivered" },
  { id: "SHP-0036", orderId: "ORD-2026-0870", customer: "Hassan Ali", carrier: "DHL Pakistan", trackingNo: "DHL-2026-1233PK", origin: "Karachi Warehouse", destination: "Rawalpindi", estimatedDelivery: "2026-06-15", status: "Delivered" },
];

const PAGE_SIZE = 5;
const CARRIERS = ["All Carriers", "TCS Courier", "Leopard Courier", "M&P Express", "DHL Pakistan"];

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

export default function ShippingPage() {
  const [carrierFilter, setCarrierFilter] = useState("All Carriers");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const preFiltered = useMemo(() => {
    return SHIPMENTS.filter((s) => {
      const matchesCarrier = carrierFilter === "All Carriers" || s.carrier === carrierFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesCarrier && matchesStatus;
    });
  }, [carrierFilter, statusFilter]);

  const { query: search, setQuery: setSearch, results: filtered } = useFuzzySearch(preFiltered, {
    keys: ["id", "customer", "trackingNo", "destination"],
    isServerSide: false,
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Shipping Management</h1>
          <p className="text-sm text-slate-500">Track shipments, manage carriers, and monitor delivery performance.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiTruck className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Shipments</p>
            <p className="text-2xl font-bold text-slate-800">1,180</p>
            <p className="text-xs text-slate-500 mt-0.5">All time</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiNavigation className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Transit</p>
            <p className="text-2xl font-bold text-slate-800">234</p>
            <p className="text-xs text-slate-500 mt-0.5">Currently moving</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivered</p>
            <p className="text-2xl font-bold text-slate-800">920</p>
            <p className="text-xs text-slate-500 mt-0.5">Successfully delivered</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiAlertCircle className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Returned</p>
            <p className="text-2xl font-bold text-slate-800">26</p>
            <p className="text-xs text-slate-500 mt-0.5">Requires attention</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by shipment ID, customer, tracking #..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={carrierFilter}
          onChange={(e) => { setCarrierFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          {CARRIERS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Shipment ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking #</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Delivery</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((shp) => (
              <tr key={shp.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-mono font-semibold text-indigo-600">{shp.id}</td>
                <td className="px-4 py-4 text-sm font-mono text-slate-600">{shp.orderId}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{shp.customer}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <FiTruck className="size-3.5 text-slate-400 shrink-0" />
                    {shp.carrier}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-mono text-slate-600">{shp.trackingNo}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{shp.destination}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{shp.estimatedDelivery}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(shp.status)}>{shp.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <FiEye className="size-4" />
                    </button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <FiEdit2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                  No shipments found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}

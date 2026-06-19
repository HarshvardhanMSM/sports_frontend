"use client";

import React from "react";
import {
  FiMapPin,
  FiCheckCircle,
  FiPackage,
  FiPieChart,
  FiUser,
  FiEdit2,
  FiEye,
} from "react-icons/fi";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  phone: string;
  status: string;
  utilization: number;
}

const WAREHOUSES: Warehouse[] = [
  {
    id: "wh-1",
    name: "Main Warehouse – Karachi",
    location: "Karachi, Pakistan",
    capacity: 5000,
    currentStock: 3780,
    manager: "Ahmed Khan",
    phone: "+92 21 1234567",
    status: "Active",
    utilization: 76,
  },
  {
    id: "wh-2",
    name: "North Hub – Lahore",
    location: "Lahore, Pakistan",
    capacity: 2500,
    currentStock: 1650,
    manager: "Sara Malik",
    phone: "+92 42 7654321",
    status: "Active",
    utilization: 66,
  },
  {
    id: "wh-3",
    name: "South Depot – Hyderabad",
    location: "Hyderabad, Pakistan",
    capacity: 1000,
    currentStock: 180,
    manager: "Raza Ali",
    phone: "+92 22 9876543",
    status: "Inactive",
    utilization: 18,
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
      {status}
    </span>
  );
}

function UtilizationBar({ value }: { value: number }) {
  const color =
    value >= 80
      ? "bg-rose-500"
      : value >= 60
        ? "bg-amber-500"
        : "bg-indigo-500";
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-500">Utilization</span>
        <span className="text-xs font-semibold text-slate-700">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function WarehousesPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Warehouses
          </h1>
          <p className="text-sm text-slate-500">
            Manage warehouse locations, capacity, and stock distribution.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiMapPin className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Warehouses
            </p>
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-xs text-slate-500 mt-0.5">locations</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active
            </p>
            <p className="text-2xl font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-500 mt-0.5">operational</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiPackage className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Capacity
            </p>
            <p className="text-2xl font-bold text-slate-800">8,500</p>
            <p className="text-xs text-slate-500 mt-0.5">units combined</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiPieChart className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Utilization
            </p>
            <p className="text-2xl font-bold text-slate-800">72%</p>
            <p className="text-xs text-slate-500 mt-0.5">
              across all warehouses
            </p>
          </div>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          Warehouse Overview
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {WAREHOUSES.map((wh) => (
            <div
              key={wh.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {wh.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <FiMapPin className="size-3 shrink-0" />
                    {wh.location}
                  </p>
                </div>
                <StatusBadge status={wh.status} />
              </div>

              {/* Manager */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <FiUser className="size-3.5 text-slate-400 shrink-0" />
                <span>{wh.manager}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{wh.phone}</span>
              </div>

              {/* Stock info */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Current Stock:{" "}
                  <span className="font-semibold text-slate-700">
                    {wh.currentStock.toLocaleString()}
                  </span>
                </span>
                <span>
                  Capacity:{" "}
                  <span className="font-semibold text-slate-700">
                    {wh.capacity.toLocaleString()}
                  </span>
                </span>
              </div>

              {/* Utilization Bar */}
              <UtilizationBar value={wh.utilization} />

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <FiEye className="size-3.5" /> View
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors">
                  <FiEdit2 className="size-3.5" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Table */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-4">Summary</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WAREHOUSES.map((wh) => (
                <tr
                  key={wh.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">
                    {wh.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {wh.location}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {wh.capacity.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {wh.currentStock.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${wh.utilization >= 80 ? "bg-rose-500" : wh.utilization >= 60 ? "bg-amber-500" : "bg-indigo-500"}`}
                          style={{ width: `${wh.utilization}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {wh.utilization}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {wh.manager}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={wh.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="size-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="View"
                      >
                        <FiEye className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { FiUsers, FiUserCheck, FiUserX, FiShield, FiUserPlus, FiUser } from "react-icons/fi";

interface Props {
  total: number;
  active: number;
  inactive: number;
}

const CARDS: {
  label: string;
  key: keyof Props;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}[] = [
  { label: "Total Users",   key: "total",    icon: <FiUsers className="size-5" />,    iconBg: "bg-indigo-50",  iconColor: "text-indigo-600" },
  { label: "Active",        key: "active",   icon: <FiUserCheck className="size-5" />, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { label: "Inactive",      key: "inactive", icon: <FiUserX className="size-5" />,     iconBg: "bg-rose-50",    iconColor: "text-rose-600" },
];

export default function UserStatsCards(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {CARDS.map((c) => (
        <div key={c.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
            <span className={c.iconColor}>{c.icon}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
            <p className="text-2xl font-bold text-slate-800">{props[c.key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPercent, FiCreditCard, FiRotateCcw } from "react-icons/fi";

interface KPIProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalRefunds: number;
  pendingSettlements: number;
  totalTaxCollected: number;
}

interface Props {
  data: KPIProps | undefined;
  isLoading: boolean;
}

const CARDS: {
  label: string;
  key: keyof KPIProps;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: React.ReactNode;
  isPercentage?: boolean;
}[] = [
  { label: "Gross Revenue",      key: "totalRevenue",       prefix: "$", color: "from-emerald-500 to-emerald-600", icon: <FiDollarSign className="size-5" /> },
  { label: "Total Expenses",     key: "totalExpenses",      prefix: "$", color: "from-rose-500 to-rose-600",       icon: <FiTrendingDown className="size-5" /> },
  { label: "Net Profit",         key: "netProfit",          prefix: "$", color: "from-indigo-500 to-indigo-600",    icon: <FiTrendingUp className="size-5" /> },
  { label: "Total Refunds",      key: "totalRefunds",       prefix: "$", color: "from-orange-500 to-orange-600",    icon: <FiRotateCcw className="size-5" /> },
  { label: "Pending Settlements",key: "pendingSettlements",  prefix: "$", color: "from-cyan-500 to-cyan-600",        icon: <FiCreditCard className="size-5" /> },
  { label: "Total Tax",          key: "totalTaxCollected",  prefix: "$", color: "from-violet-500 to-violet-600",   icon: <FiPercent className="size-5" /> },
];

function formatValue(val: number, prefix = "", suffix = "", isPercentage?: boolean): string {
  if (isPercentage) return `${val.toFixed(1)}${suffix}`;
  const absVal = Math.abs(val);
  let formatted = "";
  if (absVal >= 1_000_000) {
    formatted = (absVal / 1_000_000).toFixed(1) + "M";
  } else if (absVal >= 1_000) {
    formatted = (absVal / 1_000).toFixed(1) + "K";
  } else {
    formatted = absVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  if (val < 0) {
    return `-${prefix}${formatted}${suffix}`;
  }
  return `${prefix}${formatted}${suffix}`;
}

export default function FinancialKPICards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {CARDS.map((c) => (
          <div key={c.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="size-10 bg-slate-200 rounded-xl mb-3" />
            <div className="h-7 w-24 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {CARDS.map((c) => {
        const val = data?.[c.key] ?? 0;
        return (
          <div key={c.key} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-24 rounded-bl-full bg-gradient-to-br ${c.color} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} shadow-sm mb-3`}>
              <span className="text-white">{c.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">
              {formatValue(val, c.prefix, c.suffix, c.isPercentage)}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}

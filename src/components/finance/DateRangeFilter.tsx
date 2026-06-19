"use client";

import { useState, useCallback } from "react";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import type { DateRangePreset, DateRange } from "@/types/financial-report.types";

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "Today",         value: "today" },
  { label: "Last 7 Days",   value: "last7" },
  { label: "Last 30 Days",  value: "last30" },
  { label: "Last 90 Days",  value: "last90" },
  { label: "This Month",    value: "thisMonth" },
  { label: "This Year",     value: "thisYear" },
  { label: "Custom Range",  value: "custom" },
];

function getDateRange(preset: DateRangePreset): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  let from: string;

  switch (preset) {
    case "today":
      from = to;
      break;
    case "last7": {
      const d = new Date(now); d.setDate(d.getDate() - 7); from = d.toISOString().slice(0, 10);
      break;
    }
    case "last30": {
      const d = new Date(now); d.setDate(d.getDate() - 30); from = d.toISOString().slice(0, 10);
      break;
    }
    case "last90": {
      const d = new Date(now); d.setDate(d.getDate() - 90); from = d.toISOString().slice(0, 10);
      break;
    }
    case "thisMonth": {
      const d = new Date(now.getFullYear(), now.getMonth(), 1); from = d.toISOString().slice(0, 10);
      break;
    }
    case "thisYear": {
      const d = new Date(now.getFullYear(), 0, 1); from = d.toISOString().slice(0, 10);
      break;
    }
    default:
      from = to;
  }

  return { from, to };
}

const PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Today",
  last7: "Last 7 Days",
  last30: "Last 30 Days",
  last90: "Last 90 Days",
  thisMonth: "This Month",
  thisYear: "This Year",
  custom: "Custom Range",
};

export default function DateRangeFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(value.from);
  const [customTo, setCustomTo] = useState(value.to);

  const handlePreset = useCallback((preset: DateRangePreset) => {
    const range = getDateRange(preset);
    onChange({ ...range, preset });
    setCustomFrom(range.from);
    setCustomTo(range.to);
    setOpen(false);
  }, [onChange]);

  const handleCustomApply = useCallback(() => {
    onChange({ from: customFrom, to: customTo, preset: "custom" });
    setOpen(false);
  }, [customFrom, customTo, onChange]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
      >
        <FiCalendar className="size-4 text-slate-400" />
        <span>{PRESET_LABELS[value.preset]}</span>
        <FiChevronDown className="size-4 text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl p-3">
            <div className="space-y-1 mb-2">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    value.preset === p.value
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {value.preset === "custom" && (
              <div className="border-t border-slate-100 pt-3 mt-1 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
  showLimitSelector?: boolean;
  showPageJump?: boolean;
}

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;
const SIBLING_COUNT = 1; // pages shown on each side of current

/** Generate a compact page-number array with ellipsis markers. */
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const first = 1;
  const last = total;
  const left = Math.max(first + 1, current - SIBLING_COUNT);
  const right = Math.min(last - 1, current + SIBLING_COUNT);

  const pages: (number | "ellipsis")[] = [first];

  if (left > first + 1) pages.push("ellipsis");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < last - 1) pages.push("ellipsis");

  pages.push(last);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  showLimitSelector = false,
  showPageJump = false,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");
  const jumpRef = useRef<HTMLInputElement>(null);
  const hasMultiple = totalPages > 1;

  const pages = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

  const go = useCallback(
    (p: number) => {
      const clamped = Math.max(1, Math.min(p, totalPages));
      if (clamped !== page) onPageChange(clamped);
    },
    [page, totalPages, onPageChange],
  );

  const handleJump = useCallback(() => {
    const p = parseInt(jumpValue, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      go(p);
      setJumpValue("");
    }
  }, [jumpValue, totalPages, go]);

  const handleJumpKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleJump();
    },
    [handleJump],
  );

  if (totalPages <= 0) return null;

  const disabled = isLoading || false;

  const btn = (label: string, action: () => void, disabled_: boolean, icon?: React.ReactNode) => (
    <button
      type="button"
      disabled={disabled_ || disabled}
      onClick={action}
      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label={label}
    >
      {icon ?? label}
    </button>
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      {/* Left — info */}
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        {total === 0
          ? "0 items"
          : `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total} items`}
      </span>

      {/* Right — controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* First */}
        {hasMultiple && btn("First page", () => go(1), page === 1, <FiChevronsLeft className="size-3.5" />)}

        {/* Previous */}
        {btn("Previous page", () => go(page - 1), page === 1, <FiChevronLeft className="size-3.5" />)}

        {/* Page numbers */}
        {hasMultiple &&
          pages.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e${i}`} className="px-1 text-xs text-slate-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={p}
                type="button"
                disabled={disabled}
                onClick={() => go(p)}
                className={`flex items-center justify-center size-8 rounded-lg text-xs font-bold transition-all ${
                  p === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ),
          )}

        {/* Next */}
        {btn("Next page", () => go(page + 1), page === totalPages, <FiChevronRight className="size-3.5" />)}

        {/* Last */}
        {hasMultiple && btn("Last page", () => go(totalPages), page === totalPages, <FiChevronsRight className="size-3.5" />)}

        {/* Per-page selector */}
        {showLimitSelector && onLimitChange && (
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="ml-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
            aria-label="Items per page"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        )}

        {/* Page jump */}
        {showPageJump && hasMultiple && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-slate-400">Go to</span>
            <input
              ref={jumpRef}
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleJumpKeyDown}
              placeholder="#"
              className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Jump to page"
            />
          </div>
        )}
      </div>
    </div>
  );
}

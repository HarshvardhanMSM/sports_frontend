"use client";

import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import type { StatCardVariant } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import Pagination from "@/components/ui/pagination/Pagination";
import { FiAlertCircle } from "react-icons/fi";
import type { IconType } from "react-icons";

export interface ListPageStat {
  label: string;
  value: number | string;
  icon: IconType;
  color?: string;
  sub?: string;
  variant?: StatCardVariant;
}

export interface ListPageSelectFilter {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  selectClassName?: string;
}

export interface ListPageLayoutProps {
  // Page Header
  badge?: string;
  title: string;
  description?: string;
  headerAction?: React.ReactNode;

  // Stats Grid
  stats?: ListPageStat[];
  statsColumns?: number;

  // Filter Bar
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  selectFilters?: ListPageSelectFilter[];
  onRefresh?: () => void;
  isRefreshing?: boolean;

  // Loading & Error states
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  errorMessage?: string;
  refetch?: () => void;

  // Table Data & Pagination
  hasData: boolean;
  tableComponent: React.ReactNode;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;

  // Empty State
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;

  // Extra modals / layouts
  children?: React.ReactNode;
}

export function ListPageLayout({
  badge,
  title,
  description,
  headerAction,
  stats,
  statsColumns = 4,
  search,
  onSearchChange,
  searchPlaceholder,
  selectFilters,
  onRefresh,
  isRefreshing,
  isPending = false,
  isError = false,
  error,
  errorMessage,
  refetch,
  hasData,
  tableComponent,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  emptyIcon,
  emptyTitle = "No items found",
  emptyDescription = "There is no data to display matching the current criteria.",
  emptyAction,
  children,
}: ListPageLayoutProps) {
  // 1. Loading State (Skeleton)
  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="flex justify-between">
          <div className="space-y-2">
            {badge && <div className="h-5 w-32 bg-indigo-100 rounded" />}
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-lg" />
        </div>
        {stats && stats.length > 0 && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${statsColumns}, minmax(0, 1fr))`,
            }}
          >
            {stats.map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl" />
            ))}
          </div>
        )}
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    const errorText = error?.message || errorMessage || "An unexpected error occurred.";
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 mb-4">
          <FiAlertCircle className="size-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load {title.toLowerCase()}</h3>
        <p className="text-sm text-slate-500 mb-4">{errorText}</p>
        {refetch && (
          <button
            onClick={refetch}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // 3. Main State
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        action={headerAction}
      />

      {/* Stats Grid */}
      {stats && stats.length > 0 && (
        <StatsGrid columns={statsColumns}>
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </StatsGrid>
      )}

      {/* Filter Bar */}
      <DataFilterBar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        selectFilters={selectFilters}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Data Table or Empty State */}
      {hasData ? (
        <div className="space-y-4">
          {tableComponent}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={onPageChange}
            isLoading={isPending}
          />
        </div>
      ) : (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      )}

      {/* Optional Modals or Child components */}
      {children}
    </div>
  );
}

export default ListPageLayout;

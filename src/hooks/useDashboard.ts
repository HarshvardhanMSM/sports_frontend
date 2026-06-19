"use client";

/**
 * ─────────────────────────────────────────────────────────────────
 * useDashboard — TanStack Query hooks
 *
 * Two ways to use:
 *
 *  A) Individual hooks — when a component only needs one widget:
 *       const { data, isPending, error } = useDashboardSummary("7d");
 *
 *  B) Combined hook — recommended for the dashboard page.
 *       Owns ALL filter state; returns every query + every setter:
 *       const { filters, setters, queries } = useDashboard();
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardService,
  dashboardKeys,
} from "@/services/dashboard.service";
import type {
  GlobalPeriod,
  ChartGranularity,
  ChartPeriod,
  SignupsGranularity,
} from "@/types/dashboard.types";

// ── Shared stale time for dashboard data ─────────────────────────
const STALE = 2 * 60 * 1000; // 2 minutes

// ═══════════════════════════════════════════════════════════════════
// INDIVIDUAL HOOKS
// ═══════════════════════════════════════════════════════════════════

/** KPI cards — re-fetches when `period` changes. */
export function useDashboardSummary(period: GlobalPeriod) {
  return useQuery({
    queryKey: dashboardKeys.summary(period),
    queryFn:  () => DashboardService.getSummary(period),
    staleTime: STALE,
  });
}

/** Sales line chart — re-fetches when `granularity` changes. */
export function useSalesOverview(granularity: ChartGranularity) {
  return useQuery({
    queryKey: dashboardKeys.salesOverview(granularity),
    queryFn:  () => DashboardService.getSalesOverview(granularity),
    staleTime: STALE,
  });
}

/** Sales by category donut — re-fetches when `period` changes. */
export function useSalesByCategory(period: ChartPeriod) {
  return useQuery({
    queryKey: dashboardKeys.byCategory(period),
    queryFn:  () => DashboardService.getSalesByCategory(period),
    staleTime: STALE,
  });
}

/** Sales by payment method donut — re-fetches when `period` changes. */
export function useSalesByPayment(period: ChartPeriod) {
  return useQuery({
    queryKey: dashboardKeys.byPayment(period),
    queryFn:  () => DashboardService.getSalesByPayment(period),
    staleTime: STALE,
  });
}

/** Users area chart — re-fetches when `granularity` changes. */
export function useUsersOverview(granularity: ChartGranularity) {
  return useQuery({
    queryKey: dashboardKeys.usersOverview(granularity),
    queryFn:  () => DashboardService.getUsersOverview(granularity),
    staleTime: STALE,
  });
}

/** Users by source donut — re-fetches when `period` changes. */
export function useUsersBySource(period: ChartPeriod) {
  return useQuery({
    queryKey: dashboardKeys.bySource(period),
    queryFn:  () => DashboardService.getUsersBySource(period),
    staleTime: STALE,
  });
}

/** Signups bar chart — re-fetches when `granularity` changes. */
export function useNewUserSignups(granularity: SignupsGranularity) {
  return useQuery({
    queryKey: dashboardKeys.signups(granularity),
    queryFn:  () => DashboardService.getSignups(granularity),
    staleTime: STALE,
  });
}

/** Top products table — no filter, cached. */
export function useTopProducts() {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn:  () => DashboardService.getTopProducts(),
    staleTime: STALE,
  });
}

/** Recent orders table — no filter, shorter cache. */
export function useRecentOrders() {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(),
    queryFn:  () => DashboardService.getRecentOrders(),
    staleTime: 60_000, // 1 minute — orders change frequently
  });
}

// ═══════════════════════════════════════════════════════════════════
// COMBINED HOOK — recommended for the dashboard page
// ═══════════════════════════════════════════════════════════════════

/** Filter defaults matching the dashboard UI's initial <select> values. */
const DEFAULTS = {
  globalPeriod:        "7d"        as GlobalPeriod,
  salesGranularity:    "daily"     as ChartGranularity,
  categoryPeriod:      "this_week" as ChartPeriod,
  paymentPeriod:       "this_week" as ChartPeriod,
  usersGranularity:    "daily"     as ChartGranularity,
  sourcePeriod:        "this_week" as ChartPeriod,
  signupsGranularity:  "daily"     as SignupsGranularity,
};

export interface DashboardFilters {
  globalPeriod:       GlobalPeriod;
  salesGranularity:   ChartGranularity;
  categoryPeriod:     ChartPeriod;
  paymentPeriod:      ChartPeriod;
  usersGranularity:   ChartGranularity;
  sourcePeriod:       ChartPeriod;
  signupsGranularity: SignupsGranularity;
}

export interface DashboardSetters {
  setGlobalPeriod:       (v: GlobalPeriod) => void;
  setSalesGranularity:   (v: ChartGranularity) => void;
  setCategoryPeriod:     (v: ChartPeriod) => void;
  setPaymentPeriod:      (v: ChartPeriod) => void;
  setUsersGranularity:   (v: ChartGranularity) => void;
  setSourcePeriod:       (v: ChartPeriod) => void;
  setSignupsGranularity: (v: SignupsGranularity) => void;
}

/**
 * useDashboard()
 *
 * Drop into your DashboardPage. Owns all filter state.
 * Every setter triggers TanStack Query to re-fetch only that widget.
 *
 * @example
 * ```tsx
 * const { filters, setters, queries } = useDashboard();
 *
 * // Global period select
 * <select
 *   value={filters.globalPeriod}
 *   onChange={e => setters.setGlobalPeriod(e.target.value as GlobalPeriod)}
 * >
 *
 * // KPI cards
 * {queries.summary.isPending ? <Spinner /> : (
 *   <SparklineCard value={queries.summary.data?.totalSales.value} />
 * )}
 * ```
 */
export function useDashboard() {
  // ── Filter state ──────────────────────────────────────────────
  const [globalPeriod,       setGlobalPeriod]       = useState<GlobalPeriod>(DEFAULTS.globalPeriod);
  const [salesGranularity,   setSalesGranularity]   = useState<ChartGranularity>(DEFAULTS.salesGranularity);
  const [categoryPeriod,     setCategoryPeriod]     = useState<ChartPeriod>(DEFAULTS.categoryPeriod);
  const [paymentPeriod,      setPaymentPeriod]      = useState<ChartPeriod>(DEFAULTS.paymentPeriod);
  const [usersGranularity,   setUsersGranularity]   = useState<ChartGranularity>(DEFAULTS.usersGranularity);
  const [sourcePeriod,       setSourcePeriod]       = useState<ChartPeriod>(DEFAULTS.sourcePeriod);
  const [signupsGranularity, setSignupsGranularity] = useState<SignupsGranularity>(DEFAULTS.signupsGranularity);

  // ── Queries ────────────────────────────────────────────────────
  const summary       = useDashboardSummary(globalPeriod);
  const salesOverview = useSalesOverview(salesGranularity);
  const byCategory    = useSalesByCategory(categoryPeriod);
  const byPayment     = useSalesByPayment(paymentPeriod);
  const usersOverview = useUsersOverview(usersGranularity);
  const bySource      = useUsersBySource(sourcePeriod);
  const signups       = useNewUserSignups(signupsGranularity);
  const topProducts   = useTopProducts();
  const recentOrders  = useRecentOrders();

  return {
    filters: {
      globalPeriod,
      salesGranularity,
      categoryPeriod,
      paymentPeriod,
      usersGranularity,
      sourcePeriod,
      signupsGranularity,
    } satisfies DashboardFilters,

    setters: {
      setGlobalPeriod,
      setSalesGranularity,
      setCategoryPeriod,
      setPaymentPeriod,
      setUsersGranularity,
      setSourcePeriod,
      setSignupsGranularity,
    } satisfies DashboardSetters,

    queries: {
      summary,
      salesOverview,
      byCategory,
      byPayment,
      usersOverview,
      bySource,
      signups,
      topProducts,
      recentOrders,
    },
  };
}

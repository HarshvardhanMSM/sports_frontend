"use client";

import { useQuery } from "@tanstack/react-query";
import { ReportService, reportKeys } from "@/services/report.service";

const STALE = 5 * 60 * 1000;

export function useReportSales(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => ReportService.getSales(params),
    staleTime: STALE,
  });
}

export function useReportRevenue(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.revenue(params),
    queryFn: () => ReportService.getRevenue(params),
    staleTime: STALE,
  });
}

export function useReportProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.products(params),
    queryFn: () => ReportService.getProducts(params),
    staleTime: STALE,
  });
}

export function useReportCategories(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.categories(params),
    queryFn: () => ReportService.getCategories(params),
    staleTime: STALE,
  });
}

export function useReportBrands(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.brands(params),
    queryFn: () => ReportService.getBrands(params),
    staleTime: STALE,
  });
}

export function useReportCustomers(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.customers(params),
    queryFn: () => ReportService.getCustomers(params),
    staleTime: STALE,
  });
}

export function useReportReturns(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.returns(params),
    queryFn: () => ReportService.getReturns(params),
    staleTime: STALE,
  });
}

export function useReportInventory(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.inventory(params),
    queryFn: () => ReportService.getInventory(params),
    staleTime: STALE,
  });
}

export function useReportMarketing(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.marketing(params),
    queryFn: () => ReportService.getMarketing(params),
    staleTime: STALE,
  });
}

export function useReportSupport(params?: Record<string, string>) {
  return useQuery({
    queryKey: reportKeys.support(params),
    queryFn: () => ReportService.getSupport(params),
    staleTime: STALE,
  });
}

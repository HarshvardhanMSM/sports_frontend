"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  FiShoppingBag,
  FiMail,
  FiUsers,
  FiUserPlus,
  FiCreditCard,
  FiArrowUpRight,
  FiArrowRight,
  FiCheckSquare,
} from "react-icons/fi";
import { useDashboard, useDashboardSummary } from "@/hooks/useDashboard";
import { getImageUrl } from "@/lib/utils";
import { useReturnReasons } from "@/hooks/useReturnAnalytics";
import type {
  GlobalPeriod,
  ChartGranularity,
  ChartPeriod,
  SignupsGranularity,
  DashboardSummaryResponse,
  OrderStatus,
} from "@/types/dashboard.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Helper for sparkline configurations
const getSparklineOptions = (color: string): ApexOptions => ({
  chart: {
    type: "area",
    sparkline: {
      enabled: true,
    },
    animations: {
      enabled: true,
      speed: 800,
    },
  },
  markers: {
    size: 1,
    colors: [color],
    strokeColors: [color],
    strokeWidth: 2,
    hover: {
      size: 3,
    },
  },
  stroke: {
    curve: "straight",
    width: 2,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.52,
      stops: [0, 100],
    },
  },
  colors: [color],
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: () => "",
      },
    },
    marker: {
      show: false,
    },
  },
});

// Formatting Utilities
const formatCurrency = (val?: number, decimals: number = 0) => {
  if (val === undefined || val === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
};

const formatNumber = (val?: number) => {
  if (val === undefined || val === null) return "";
  return val.toLocaleString();
};

const formatRelativeTime = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "just now";
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } catch (e) {
    return dateStr;
  }
};

const getComparisonLabel = (period: GlobalPeriod) => {
  switch (period) {
    case "7d":
      return "vs last week";
    case "30d":
      return "vs last month";
    case "this_month":
      return "vs last month";
    case "this_year":
      return "vs last year";
    default:
      return "vs last week";
  }
};

// Skeleton Loader Components for Premium UI
const SkeletonText = () => (
  <span className="inline-block w-20 h-5 rounded-md bg-slate-100 animate-pulse" />
);

const SkeletonTrend = () => (
  <span className="inline-block w-16 h-4 rounded-md bg-slate-100 animate-pulse" />
);

export default function DashboardPage() {
  const { filters, setters, queries } = useDashboard();
  const monthSummaryQuery = useDashboardSummary("this_month");
  const returnReasonsQuery = useReturnReasons();

  // Query data is now typed directly (service unwraps the API wrapper)
  const summaryData = queries.summary.data;
  const monthSummaryData = monthSummaryQuery.data;
  const salesOverviewData = queries.salesOverview.data;
  const byCategoryData = queries.byCategory.data ?? [];
  const byPaymentData = queries.byPayment.data ?? [];
  const usersOverviewData = queries.usersOverview.data;
  const bySourceData = queries.bySource.data?.data ?? [];
  const signupsData = queries.signups.data;
  const topProductsList = queries.topProducts.data?.products ?? [];
  const recentOrdersList = queries.recentOrders.data?.orders ?? [];

  // Format Helper for Card values
  const getSummaryValue = (data: DashboardSummaryResponse | undefined | null, isPending: boolean, key: keyof DashboardSummaryResponse): string | null => {
    if (isPending || !data?.[key]) return null;
    const item = data[key];
    if (key === "totalSales") return formatCurrency(item.value, 0);
    if (key === "avgOrderValue") return formatCurrency(item.value, 2);
    if (key === "conversionRate") return `${item.value.toFixed(2)}%`;
    return formatNumber(item.value);
  };

  const getSummaryChange = (data: DashboardSummaryResponse | undefined | null, _isPending: boolean, key: keyof DashboardSummaryResponse): string | null => {
    if (!data?.[key]) return null;
    return `${data[key].changePercent}%`;
  };

  const getSummaryTrend = (data: DashboardSummaryResponse | undefined | null, _isPending: boolean, key: keyof DashboardSummaryResponse): "up" | "down" => {
    return data?.[key]?.direction ?? "up";
  };

  const getSummarySparkline = (data: DashboardSummaryResponse | undefined | null, _isPending: boolean, key: keyof DashboardSummaryResponse, defaultData: number[]): number[] => {
    return data?.[key]?.sparkline ?? defaultData;
  };

  // Sparkline data fallbacks
  const sparklineData1 = [30, 40, 35, 50, 45, 60, 55];
  const sparklineData2 = [50, 40, 60, 45, 55, 40, 50];
  const sparklineData3 = [30, 35, 32, 45, 38, 48, 42];
  const sparklineData4 = [55, 45, 50, 40, 60, 48, 55];
  const sparklineData5 = [30, 45, 35, 50, 40, 55, 45];
  const sparklineData6 = [45, 50, 40, 55, 48, 60, 52];

  // Sales Overview Area/Line Chart Options
  const getOverviewSeriesNames = (g: ChartGranularity) => {
    if (g === "daily") return { current: "This Week", previous: "Last Week" };
    if (g === "weekly") return { current: "This Month", previous: "Last Month" };
    return { current: "This Year", previous: "Last Year" };
  };

  const salesSeriesNames = getOverviewSeriesNames(filters.salesGranularity);

  const salesOverviewOptions: ApexOptions = {
    colors: ["#3b82f6", "#94a3b8"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
      dashArray: [0, 4],
    },
    fill: {
      type: ["solid", "gradient"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.28,
        opacityTo: 0.20,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: salesOverviewData?.categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => {
          if (val === 0) return "$0";
          if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
          return `$${val}`;
        },
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 0,
    },
    markers: {
      size: 2,
      colors: ["#3b82f6", "#cbd5e1"],
      strokeColors: ["#3b82f6", "#94a3b8"],
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const date = (w.config.xaxis && w.config.xaxis.categories && w.config.xaxis.categories[dataPointIndex]) || "";
        const valCurrent = series[0] && series[0][dataPointIndex] !== undefined
          ? series[0][dataPointIndex].toLocaleString()
          : "0";
        const valPrevious = series[1] && series[1][dataPointIndex] !== undefined
          ? series[1][dataPointIndex].toLocaleString()
          : "0";
        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); min-width: 145px; font-family: Outfit, sans-serif;">
            <div style="font-weight: 600; color: #64748b; font-size: 11px; margin-bottom: 8px;">${date}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #3b82f6;"></span>
                <span>${salesSeriesNames.current}</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">$${valCurrent}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #94a3b8;"></span>
                <span>${salesSeriesNames.previous}</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">$${valPrevious}</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
  };

  const salesOverviewSeries = [
    {
      name: salesSeriesNames.current,
      type: "line",
      data: salesOverviewData?.currentPeriod ?? [],
    },
    {
      name: salesSeriesNames.previous,
      type: "area",
      data: salesOverviewData?.previousPeriod ?? [],
    },
  ];

  // Donut Chart - Sales by Category Options
  const categoryDonutOptions: ApexOptions = {
    colors: ["#6366f1", "#3b82f6", "#eab308", "#ef4444", "#10b981"],
    chart: {
      type: "donut",
      height: 220,
    },
    labels: byCategoryData?.map((item) => item.label) || [],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  const categoryDonutSeries = byCategoryData?.map((item) => item.percentage) || [];
  const categoryColors = ["#6366f1", "#3b82f6", "#eab308", "#ef4444", "#10b981"];
  const categoryLegendData = byCategoryData?.map((item, index) => ({
    label: item.label,
    percentage: item.percentage,
    value: formatCurrency(item.revenue),
    color: categoryColors[index % categoryColors.length],
  })) || [];

  // Donut Chart - Sales by Payment Method
  const paymentDonutOptions: ApexOptions = {
    colors: ["#14b8a6", "#6366f1", "#eab308", "#ef4444"],
    chart: {
      type: "donut",
      height: 220,
    },
    labels: byPaymentData?.map((item) => item.label) || [],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  const paymentDonutSeries = byPaymentData?.map((item) => item.percentage) || [];
  const paymentColors = ["#14b8a6", "#6366f1", "#eab308", "#ef4444"];
  const paymentLegendData = byPaymentData?.map((item, index) => ({
    label: item.label,
    percentage: item.percentage,
    value: formatCurrency(item.revenue),
    color: paymentColors[index % paymentColors.length],
  })) || [];

  // Users Overview Line/Area Chart Options
  const usersOverviewOptions: ApexOptions = {
    colors: ["#1c66ddff", "#48a888ff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 2,
      colors: ["#1c66ddff", "#48a888ff"],
      strokeColors: ["#1c66ddff", "#48a888ff"],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.20,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: usersOverviewData?.categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => {
          if (val === 0) return "0";
          if (val >= 1000) return `${val / 1000}K`;
          return `${val}`;
        },
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const date = (w.config.xaxis && w.config.xaxis.categories && w.config.xaxis.categories[dataPointIndex]) || "";
        const valTotal = series[0] && series[0][dataPointIndex] !== undefined
          ? series[0][dataPointIndex].toLocaleString()
          : "0";
        const valNew = series[1] && series[1][dataPointIndex] !== undefined
          ? series[1][dataPointIndex].toLocaleString()
          : "0";
        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); min-width: 145px; font-family: Outfit, sans-serif;">
            <div style="font-weight: 600; color: #64748b; font-size: 11px; margin-bottom: 8px;">${date}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #3b82f6;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #3b82f6;"></span>
                <span>Total Users</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">${valTotal}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #10b981;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #10b981;"></span>
                <span>New Users</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">${valNew}</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      show: false,
    },
  };

  const usersOverviewSeries = [
    {
      name: "Total Users",
      data: usersOverviewData?.totalUsers ?? [],
    },
    {
      name: "New Users",
      data: usersOverviewData?.newUsers ?? [],
    },
  ];

  // Donut Chart - Return Reasons Options
  const returnReasonsData = returnReasonsQuery.data?.data ?? [];
  const parsedReturnReasons = returnReasonsData.map((item) => ({
    reason: item.reason,
    count: parseInt(item.count) || 0,
  }));
  const totalReturnReasonsCount = parsedReturnReasons.reduce((acc, item) => acc + item.count, 0);

  const reasonsDonutOptions: ApexOptions = {
    colors: ["#ef4444", "#eab308", "#3b82f6", "#10b981", "#6366f1", "#ec4899"],
    chart: {
      type: "donut",
      height: 220,
    },
    labels: parsedReturnReasons.map((item) => item.reason) || [],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  const reasonsDonutSeries = parsedReturnReasons.map((item) =>
    totalReturnReasonsCount > 0 ? Math.round((item.count / totalReturnReasonsCount) * 100) : 0
  );
  const reasonsColors = ["#ef4444", "#eab308", "#3b82f6", "#10b981", "#6366f1", "#ec4899"];
  const reasonsLegendData = parsedReturnReasons.map((item, index) => {
    const pct = totalReturnReasonsCount > 0 ? Math.round((item.count / totalReturnReasonsCount) * 100) : 0;
    return {
      label: item.reason,
      percentage: pct,
      value: item.count.toLocaleString(),
      color: reasonsColors[index % reasonsColors.length],
    };
  });

  // Bar Chart - New Users Signups
  const signupsOptions: ApexOptions = {
    colors: ["#a78bfa"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: signupsData?.categories || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: {
          colors: "#64748b",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} users`,
      },
    },
  };

  const signupsSeries = [
    {
      name: "Signups",
      data: signupsData?.signups || [],
    },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        .apexcharts-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Welcome & Timeframe Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back, Tom. Here is what is happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.globalPeriod}
            onChange={(e) => setters.setGlobalPeriod(e.target.value as GlobalPeriod)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
      </div>

      {/* Row 1: Six Stats Cards with Sparklines */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SparklineCard
          title="Total Sales"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "totalSales")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "totalSales")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "totalSales")}
          color="#3b82f6"
          iconBg="bg-blue-50 text-blue-600"
          Icon={FiShoppingBag}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "totalSales", sparklineData1)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
        <SparklineCard
          title="Total Orders"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "totalOrders")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "totalOrders")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "totalOrders")}
          color="#10b981"
          iconBg="bg-emerald-50 text-emerald-600"
          Icon={FiMail}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "totalOrders", sparklineData2)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
        <SparklineCard
          title="Total Users"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "totalUsers")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "totalUsers")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "totalUsers")}
          color="#f59e0b"
          iconBg="bg-amber-50 text-amber-600"
          Icon={FiUsers}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "totalUsers", sparklineData3)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
        <SparklineCard
          title="New Users"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "newUsers")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "newUsers")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "newUsers")}
          color="#8b5cf6"
          iconBg="bg-purple-50 text-purple-600"
          Icon={FiUserPlus}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "newUsers", sparklineData4)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
        <SparklineCard
          title="Conversion Rate"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "conversionRate")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "conversionRate")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "conversionRate")}
          color="#ec4899"
          iconBg="bg-pink-50 text-pink-600"
          Icon={FiCheckSquare}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "conversionRate", sparklineData5)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
        <SparklineCard
          title="Average Order Value"
          value={getSummaryValue(queries.summary.data, queries.summary.isPending, "avgOrderValue")}
          percentage={getSummaryChange(queries.summary.data, queries.summary.isPending, "avgOrderValue")}
          trend={getSummaryTrend(queries.summary.data, queries.summary.isPending, "avgOrderValue")}
          color="#14b8a6"
          iconBg="bg-teal-50 text-teal-600"
          Icon={FiCreditCard}
          chartData={getSummarySparkline(queries.summary.data, queries.summary.isPending, "avgOrderValue", sparklineData6)}
          isLoading={queries.summary.isPending}
          comparisonLabel={getComparisonLabel(filters.globalPeriod)}
        />
      </div>

      {/* Row 2: Sales Overview, Sales by Category, Sales by Payment Method */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-12">
        {/* Sales Overview Line Chart */}
        <div className="md:col-span-2 xl:col-span-6 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Sales Overview</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 h-[2px] bg-blue-500"></span>
                    <span className="absolute size-2 rounded-full bg-blue-500 border border-white"></span>
                  </div>
                  {salesSeriesNames.current}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 border-t-[2px] border-dashed border-slate-300"></span>
                    <span className="absolute size-2 rounded-full bg-slate-300 border border-white"></span>
                  </div>
                  {salesSeriesNames.previous}
                </div>
              </div>
            </div>
            <select
              value={filters.salesGranularity}
              onChange={(e) => setters.setSalesGranularity(e.target.value as ChartGranularity)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="w-full">
            {queries.salesOverview.isPending ? (
              <div className="flex items-center justify-center h-[180px] w-full bg-slate-50/50 rounded-xl animate-pulse text-xs text-slate-400 font-medium">
                Loading Sales Overview...
              </div>
            ) : (
              <ReactApexChart
                options={salesOverviewOptions}
                series={salesOverviewSeries}
                type="line"
                height={180}
              />
            )}
          </div>
        </div>

        {/* Sales by Category Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Sales by Category</h3>
            <select
              value={filters.categoryPeriod}
              onChange={(e) => setters.setCategoryPeriod(e.target.value as ChartPeriod)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
            {queries.byCategory.isPending ? (
              <div className="flex items-center justify-center w-full h-[120px] bg-slate-50/50 rounded-xl animate-pulse text-[10px] text-slate-400 font-medium">
                Loading Category Sales...
              </div>
            ) : (
              <>
                <div className="w-[120px] flex-shrink-0 flex items-center justify-center">
                  <ReactApexChart
                    options={categoryDonutOptions}
                    series={categoryDonutSeries}
                    type="donut"
                    height={120}
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-[140px]">
                  {categoryLegendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-500 truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-right flex-shrink-0 ml-1">
                        <span className="font-semibold text-slate-800">{item.percentage}%</span>
                        <span className="text-slate-400">({item.value})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sales by Payment Method Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Sales by Payment Method</h3>
            <select
              value={filters.paymentPeriod}
              onChange={(e) => setters.setPaymentPeriod(e.target.value as ChartPeriod)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
            >
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
            {queries.byPayment.isPending ? (
              <div className="flex items-center justify-center w-full h-[120px] bg-slate-50/50 rounded-xl animate-pulse text-[10px] text-slate-400 font-medium">
                Loading Payments...
              </div>
            ) : (
              <>
                <div className="w-[120px] flex-shrink-0 flex items-center justify-center">
                  <ReactApexChart
                    options={paymentDonutOptions}
                    series={paymentDonutSeries}
                    type="donut"
                    height={120}
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-[140px]">
                  {paymentLegendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-500 truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-right flex-shrink-0 ml-1">
                        <span className="font-semibold text-slate-800">{item.percentage}%</span>
                        <span className="text-slate-400">({item.value})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Users Overview, Users by Source, New Users Signups */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-12">
        {/* Users Overview Area Chart */}
        <div className="md:col-span-2 xl:col-span-6 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Users Overview</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 h-[2px] bg-blue-500"></span>
                    <span className="absolute size-2 rounded-full bg-blue-500 border border-white"></span>
                  </div>
                  Total Users
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 h-[2px] bg-emerald-500"></span>
                    <span className="absolute size-2 rounded-full bg-emerald-500 border border-white"></span>
                  </div>
                  New Users
                </div>
              </div>
            </div>
            <select
              value={filters.usersGranularity}
              onChange={(e) => setters.setUsersGranularity(e.target.value as ChartGranularity)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="w-full">
            {queries.usersOverview.isPending ? (
              <div className="flex items-center justify-center h-[180px] w-full bg-slate-50/50 rounded-xl animate-pulse text-xs text-slate-400 font-medium">
                Loading Users Overview...
              </div>
            ) : (
              <ReactApexChart
                options={usersOverviewOptions}
                series={usersOverviewSeries}
                type="area"
                height={180}
              />
            )}
          </div>
        </div>

        {/* Return Reasons Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Return Reasons</h3>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
            {returnReasonsQuery.isPending ? (
              <div className="flex items-center justify-center w-full h-[120px] bg-slate-50/50 rounded-xl animate-pulse text-[10px] text-slate-400 font-medium">
                Loading Reasons...
              </div>
            ) : (
              <>
                <div className="w-[120px] flex-shrink-0 flex items-center justify-center">
                  <ReactApexChart
                    options={reasonsDonutOptions}
                    series={reasonsDonutSeries}
                    type="donut"
                    height={120}
                  />
                </div>
                <div className="flex-1 space-y-2 min-w-[140px]">
                  {reasonsLegendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-slate-500 truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-right flex-shrink-0 ml-1">
                        <span className="font-semibold text-slate-800">{item.percentage}%</span>
                        <span className="text-slate-400">({item.value})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* New Users Signups Bar Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">New Users Signups</h3>
            <select
              value={filters.signupsGranularity}
              onChange={(e) => setters.setSignupsGranularity(e.target.value as SignupsGranularity)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="w-full">
            {queries.signups.isPending ? (
              <div className="flex items-center justify-center h-[180px] w-full bg-slate-50/50 rounded-xl animate-pulse text-xs text-slate-400 font-medium">
                Loading Signups...
              </div>
            ) : (
              <ReactApexChart
                options={signupsOptions}
                series={signupsSeries}
                type="bar"
                height={180}
              />
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Sales Overview (This Month), Top Selling Products, Recent Orders */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
        {/* Sales Overview (This Month) */}
        <div className="md:col-span-1 xl:col-span-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">
            Sales Overview{" "}
            <span className="text-xs font-normal text-slate-400">
              (This Month)
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Total Sales */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Total Sales
              </div>

              <div className="mt-1 text-xl font-bold text-slate-800">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <SkeletonText />
                ) : (
                  getSummaryValue(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalSales")
                )}
              </div>

              <div className="mt-1 flex items-center gap-0.5 flex-wrap text-[10px] font-semibold text-emerald-600">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <SkeletonTrend />
                ) : (
                  <>
                    <FiArrowUpRight className="size-3 shrink-0" style={{ transform: getSummaryTrend(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalSales") === "down" ? "rotate(90deg)" : "none" }} />
                    {getSummaryChange(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalSales")}
                    <span className="font-medium text-slate-400">
                      vs last month
                    </span>
                  </>
                )}
              </div>

              <div className="mt-2 h-8">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <div className="h-8 w-full bg-slate-50 rounded-sm animate-pulse" />
                ) : (
                  <ReactApexChart
                    options={getSparklineOptions("#3b82f6")}
                    series={[{ data: getSummarySparkline(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalSales", sparklineData1) }]}
                    type="area"
                    height={32}
                  />
                )}
              </div>
            </div>

            {/* Total Orders */}
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Total Orders
              </div>

              <div className="mt-1 text-xl font-bold text-slate-800">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <SkeletonText />
                ) : (
                  getSummaryValue(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalOrders")
                )}
              </div>

              <div className="mt-1 flex items-center gap-0.5 flex-wrap text-[10px] font-semibold text-emerald-600">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <SkeletonTrend />
                ) : (
                  <>
                    <FiArrowUpRight className="size-3 shrink-0" style={{ transform: getSummaryTrend(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalOrders") === "down" ? "rotate(90deg)" : "none" }} />
                    {getSummaryChange(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalOrders")}
                    <span className="font-medium text-slate-400">
                      vs last month
                    </span>
                  </>
                )}
              </div>

              <div className="mt-2 h-8">
                {monthSummaryQuery.isPending || !monthSummaryData ? (
                  <div className="h-8 w-full bg-slate-50 rounded-sm animate-pulse" />
                ) : (
                  <ReactApexChart
                    options={getSparklineOptions("#10b981")}
                    series={[{ data: getSummarySparkline(monthSummaryQuery.data, monthSummaryQuery.isPending, "totalOrders", sparklineData2) }]}
                    type="area"
                    height={32}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="md:col-span-1 xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-2">Product</th>
                  <th className="pb-2 pr-1 text-right">Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.topProducts.isPending ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-slate-100 shrink-0" />
                          <div className="flex-1 space-y-1">
                            <div className="h-3 w-28 bg-slate-100 rounded-sm" />
                            <div className="h-2 w-16 bg-slate-50 rounded-sm" />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-right"><div className="h-3 w-8 bg-slate-100 rounded-sm ml-auto" /></td>
                      <td className="py-2.5 text-right"><div className="h-3 w-12 bg-slate-100 rounded-sm ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  topProductsList?.map((product) => {
                    return (
                      <ProductRow
                        key={product.id}
                        name={product.name}
                        type={product.category}
                        sold={product.unitsSold}
                        revenue={formatCurrency(product.revenue, 0)}
                        imageUrl={product.imageUrl}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-3 pt-3 border-t border-slate-100">
            <button className="text-[11px] font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-4 py-1.5 rounded-lg bg-white shadow-2xs transition-colors">
              View All Products
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              View All <FiArrowRight className="size-3" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <tbody className="divide-y divide-slate-50">
                {queries.recentOrders.isPending ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 pr-2"><div className="h-3 w-12 bg-slate-100 rounded-sm" /></td>
                      <td className="py-3 pr-2"><div className="h-3 w-24 bg-slate-100 rounded-sm" /></td>
                      <td className="py-3 pr-2"><div className="h-3 w-12 bg-slate-100 rounded-sm" /></td>
                      <td className="py-3 pr-2"><div className="h-5 w-14 bg-slate-100 rounded-full" /></td>
                      <td className="py-3 text-right"><div className="h-3 w-16 bg-slate-100 rounded-sm ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  recentOrdersList?.map((order) => {
                    return (
                      <OrderRow
                        key={order.id}
                        id={order.id}
                        name={order.customerName}
                        amount={formatCurrency(order.amount, 2)}
                        status={order.status}
                        time={formatRelativeTime(order.createdAt)}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: SparklineCard
interface SparklineCardProps {
  title: string;
  value: string | null;
  percentage: string | null;
  trend: "up" | "down";
  color: string;
  iconBg: string;
  Icon: React.ComponentType<{ className?: string }>;
  chartData: number[];
  isLoading: boolean;
  comparisonLabel: string;
}

const SparklineCard = ({
  title,
  value,
  percentage,
  trend,
  color,
  iconBg,
  Icon,
  chartData,
  isLoading,
  comparisonLabel,
}: SparklineCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {title}
          </span>
          <span className="block text-xl font-bold text-slate-800 leading-tight mt-0.5 min-h-[1.75rem]">
            {isLoading ? <SkeletonText /> : value}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 flex-wrap min-h-[1.25rem]">
        {isLoading ? (
          <SkeletonTrend />
        ) : (
          <>
            <span className={`text-[10px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm whitespace-nowrap ${
              trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {trend === "up" ? "↑" : "↓"} {percentage}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{comparisonLabel}</span>
          </>
        )}
      </div>
      <div className="mt-3 h-10 -mx-1">
        {isLoading ? (
          <div className="h-10 w-full bg-slate-50/50 rounded-md animate-pulse" />
        ) : (
          <ReactApexChart
            options={getSparklineOptions(color)}
            series={[{ data: chartData }]}
            type="area"
            height={40}
          />
        )}
      </div>
    </div>
  );
};

// Subcomponent: ProductRow
interface ProductRowProps {
  name: string;
  type: string;
  sold: number;
  revenue: string;
  imageUrl: string;
}

const ProductRow = ({ name, type, sold, revenue, imageUrl }: ProductRowProps) => {
  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="py-2.5 pr-2">
        <div className="flex items-center gap-2.5">
          <div className="size-15 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <img src={getImageUrl(imageUrl)} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <span className="block font-semibold text-slate-800 leading-tight truncate">{name}</span>
            <span className="text-[10px] text-slate-400 font-medium">{type}</span>
          </div>
        </div>
      </td>
      <td className="py-2.5 text-center font-semibold text-slate-800">{sold}</td>
      <td className="py-2.5 text-right font-semibold text-slate-800">{revenue}</td>
    </tr>
  );
};

// Subcomponent: OrderRow
interface OrderRowProps {
  id: string;
  name: string;
  amount: string;
  status: OrderStatus;
  time: string;
}

const OrderRow = ({ id, name, amount, status, time }: OrderRowProps) => {
  let statusClass = "bg-slate-50 text-slate-700 border-slate-100";
  if (status === "Paid") {
    statusClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
  } else if (status === "Pending") {
    statusClass = "bg-amber-50 text-amber-700 border-amber-100";
  } else if (status === "Failed") {
    statusClass = "bg-red-50 text-red-700 border-red-100";
  } else if (status === "Refunded") {
    statusClass = "bg-blue-50 text-blue-700 border-blue-100";
  }

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3 pr-2 font-semibold text-blue-600 text-[11px]">{id}</td>
      <td className="py-3 pr-2">
        <span className="font-semibold text-slate-800">{name}</span>
      </td>
      <td className="py-3 pr-2 font-semibold text-slate-800">{amount}</td>
      <td className="py-3 pr-2">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusClass}`}>
          {status}
        </span>
      </td>
      <td className="py-3 text-right text-slate-400 font-medium text-[10px] whitespace-nowrap">{time}</td>
    </tr>
  );
};

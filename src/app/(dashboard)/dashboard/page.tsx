"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  FiShoppingBag,
  FiMail,
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiCreditCard,
  FiArrowUpRight,
  FiArrowRight,
  FiCheckSquare,
} from "react-icons/fi";

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
      colors:[color],
      strokeColors: [color] ,
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

export default function DashboardPage() {
  // Sparkline data matching the image styles
  const sparklineData1 = [30, 40, 35, 50, 45, 60, 55];
  const sparklineData2 = [50, 40, 60, 45, 55, 40, 50];
  const sparklineData3 = [30, 35, 32, 45, 38, 48, 42];
  const sparklineData4 = [55, 45, 50, 40, 60, 48, 55];
  const sparklineData5 = [30, 45, 35, 50, 40, 55, 45];
  const sparklineData6 = [45, 50, 40, 55, 48, 60, 52];

  // Sales Overview Area/Line Chart Options
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
      categories: ["15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May"],
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
      min: 0,
      max: 40000,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => val === 0 ? "$0" : `$${val / 1000}K`,
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
colors: [
  "#3b82f6",
  "#cbd5e1",
],      strokeColors: ["#3b82f6", "#94a3b8"],
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
        const valThisWeek = series[0] && series[0][dataPointIndex] !== undefined
          ? series[0][dataPointIndex].toLocaleString()
          : "0";
        const valLastWeek = series[1] && series[1][dataPointIndex] !== undefined
          ? series[1][dataPointIndex].toLocaleString()
          : "0";
        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); min-width: 145px; font-family: Outfit, sans-serif;">
            <div style="font-weight: 600; color: #64748b; font-size: 11px; margin-bottom: 8px;">${date} 2024</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #3b82f6;"></span>
                <span>This Week</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">$${valThisWeek}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #94a3b8;"></span>
                <span>Last Week</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">$${valLastWeek}</span>
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
      name: "This Week",
      type: "line",
      data: [19000, 16000, 28000, 24560, 13000, 17000, 34000],
    },
    {
      name: "Last Week",
      type: "area",
      data: [10000, 13000, 18500, 18240, 15000, 18000, 25000],
    },
  ];

  // Donut Chart - Sales by Category Options
  const categoryDonutOptions: ApexOptions = {
    colors: ["#6366f1", "#3b82f6", "#eab308", "#ef4444", "#10b981"],
    chart: {
      type: "donut",
      height: 220,
    },
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

  const categoryDonutSeries = [30, 25, 20, 15, 10];
  const categoryLegendData = [
    { label: "T-Shirts", percentage: 30, value: "$43,704", color: "#6366f1" },
    { label: "Shoes", percentage: 25, value: "$36,420", color: "#3b82f6" },
    { label: "Hoodies", percentage: 20, value: "$29,136", color: "#eab308" },
    { label: "Shorts", percentage: 15, value: "$21,852", color: "#ef4444" },
    { label: "Tracksuits", percentage: 10, value: "$14,568", color: "#10b981" },
  ];

  // Donut Chart - Sales by Payment Method
  const paymentDonutOptions: ApexOptions = {
    colors: ["#14b8a6", "#6366f1", "#eab308", "#ef4444"],
    chart: {
      type: "donut",
      height: 220,
    },
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

  const paymentDonutSeries = [45, 25, 20, 10];
  const paymentLegendData = [
    { label: "Credit Card", percentage: 45, value: "$65,556", color: "#14b8a6" },
    { label: "PayPal", percentage: 25, value: "$36,420", color: "#6366f1" },
    { label: "COD", percentage: 20, value: "$29,136", color: "#eab308" },
    { label: "Wallet", percentage: 10, value: "$14,568", color: "#ef4444" },
  ];

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
      categories: ["15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May"],
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
      min: 0,
      max: 4000,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => val === 0 ? "0" : `${val / 1000}K`,
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
            <div style="font-weight: 600; color: #64748b; font-size: 11px; margin-bottom: 8px;">${date} 2024</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                <span style="display: inline-block; width: 3px; height: 12px; border-radius: 9999px; background-color: #3b82f6;"></span>
                <span>Total Users</span>
              </div>
              <span style="font-weight: 700; color: #0f172a;">${valTotal}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
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
      data: [2000, 2700, 2000, 3400, 2300, 1700, 3400],
    },
    {
      name: "New Users",
      data: [800, 1400, 1000, 2500, 1200, 1000, 2300],
    },
  ];

  // Donut Chart - Users by Source
  const sourceDonutOptions: ApexOptions = {
    colors: ["#3b82f6", "#6366f1", "#eab308", "#ef4444"],
    chart: {
      type: "donut",
      height: 220,
    },
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

  const sourceDonutSeries = [40, 30, 20, 10];
  const sourceLegendData = [
    { label: "Direct", percentage: 40, value: "1,537", color: "#3b82f6" },
    { label: "Organic Search", percentage: 30, value: "1,153", color: "#6366f1" },
    { label: "Social Media", percentage: 20, value: "768", color: "#eab308" },
    { label: "Referral", percentage: 10, value: "384", color: "#ef4444" },
  ];

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
      categories: ["15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May"],
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
      min: 0,
      max: 200,
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
      data: [115, 105, 140, 175, 150, 105, 140],
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
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Row 1: Six Stats Cards with Sparklines */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SparklineCard
          title="Total Sales"
          value="$145,680"
          percentage="18.6%"
          trend="up"
          color="#3b82f6"
          iconBg="bg-blue-50 text-blue-600"
          Icon={FiShoppingBag}
          chartData={sparklineData1}
        />
        <SparklineCard
          title="Total Orders"
          value="1,250"
          percentage="12.4%"
          trend="up"
          color="#10b981"
          iconBg="bg-emerald-50 text-emerald-600"
          Icon={FiMail}
          chartData={sparklineData2}
        />
        <SparklineCard
          title="Total Users"
          value="3,842"
          percentage="15.3%"
          trend="up"
          color="#f59e0b"
          iconBg="bg-amber-50 text-amber-600"
          Icon={FiUsers}
          chartData={sparklineData3}
        />
        <SparklineCard
          title="New Users"
          value="568"
          percentage="22.1%"
          trend="up"
          color="#8b5cf6"
          iconBg="bg-purple-50 text-purple-600"
          Icon={FiUserPlus}
          chartData={sparklineData4}
        />
        <SparklineCard
          title="Conversion Rate"
          value="2.85%"
          percentage="8.7%"
          trend="up"
          color="#ec4899"
          iconBg="bg-pink-50 text-pink-600"
          Icon={FiCheckSquare}
          chartData={sparklineData5}
        />
        <SparklineCard
          title="Average Order Value"
          value="$116.54"
          percentage="6.3%"
          trend="up"
          color="#14b8a6"
          iconBg="bg-teal-50 text-teal-600"
          Icon={FiCreditCard}
          chartData={sparklineData6}
        />
      </div>

      {/* Row 2: Sales Overview, Sales by Category, Sales by Payment Method */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-12">
        {/* Sales Overview Line Chart */}
        <div className="md:col-span-2 xl:col-span-6 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Sales Overview</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 h-[2px] bg-blue-500"></span>
                    <span className="absolute size-2 rounded-full bg-blue-500 border border-white"></span>
                  </div>
                  This Week
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-center relative w-6 h-3">
                    <span className="absolute w-6 border-t-[2px] border-dashed border-slate-300"></span>
                    <span className="absolute size-2 rounded-full bg-slate-300 border border-white"></span>
                  </div>
                  Last Week
                </div>
              </div>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="w-full">
            <ReactApexChart
              options={salesOverviewOptions}
              series={salesOverviewSeries}
              type="line"
              height={180}
            />
          </div>
        </div>

        {/* Sales by Category Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Sales by Category</h3>
            <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
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
          </div>
        </div>

        {/* Sales by Payment Method Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border min-h-[280px] border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Sales by Payment Method</h3>
            <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
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
          </div>
        </div>
      </div>

      {/* Row 3: Users Overview, Users by Source, New Users Signups */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-12">
        {/* Users Overview Area Chart */}
        <div className="md:col-span-2 xl:col-span-6 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-5 shadow-sm">
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
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="w-full">
            <ReactApexChart
              options={usersOverviewOptions}
              series={usersOverviewSeries}
              type="area"
              height={180}
            />
          </div>
        </div>

        {/* Users by Source Donut Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Users by Source</h3>
            <select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center justify-center gap-4 flex-1 flex-wrap">
            <div className="w-[120px] flex-shrink-0 flex items-center justify-center">
              <ReactApexChart
                options={sourceDonutOptions}
                series={sourceDonutSeries}
                type="donut"
                height={120}
              />
            </div>
            <div className="flex-1 space-y-2 min-w-[140px]">
              {sourceLegendData.map((item, index) => (
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
          </div>
        </div>

        {/* New Users Signups Bar Chart */}
        <div className="md:col-span-1 xl:col-span-3 rounded-2xl border border-slate-200 min-h-[280px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">New Users Signups</h3>
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 outline-none hover:bg-slate-50">
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="w-full">
            <ReactApexChart
              options={signupsOptions}
              series={signupsSeries}
              type="bar"
              height={180}
            />
          </div>
        </div>
      </div>

      {/* Row 4: Sales Overview (This Month), Top Selling Products, Recent Orders */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">       {/* Sales Overview (This Month) */}
<div className="md:col-span-1 xl:col-span-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
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
        $145,680
      </div>

      <div className="mt-1 flex items-center gap-0.5 flex-wrap text-[10px] font-semibold text-emerald-600">
        <FiArrowUpRight className="size-3 shrink-0" />
        18.6%
        <span className="font-medium text-slate-400">
          vs last month
        </span>
      </div>

      <div className="mt-2 h-8">
        <ReactApexChart
          options={getSparklineOptions("#3b82f6")}
          series={[{ data: sparklineData1 }]}
          type="area"
          height={32}
        />
      </div>
    </div>

    {/* Total Orders */}
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Total Orders
      </div>

      <div className="mt-1 text-xl font-bold text-slate-800">
        1,250
      </div>

      <div className="mt-1 flex items-center gap-0.5 flex-wrap text-[10px] font-semibold text-emerald-600">
        <FiArrowUpRight className="size-3 shrink-0" />
        12.4%
        <span className="font-medium text-slate-400">
          vs last month
        </span>
      </div>

      <div className="mt-2 h-8">
        <ReactApexChart
          options={getSparklineOptions("#10b981")}
          series={[{ data: sparklineData2 }]}
          type="area"
          height={32}
        />
      </div>
    </div>
  </div>
</div>

        {/* Top Selling Products */}
        <div className="md:col-span-1 xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-right">Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <ProductRow
                  name="Men's Running Shoes"
                  type="Footwear"
                  sold={320}
                  revenue="$19,200"
                  iconPath={
                    <svg className="size-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12h18M3 12a9 9 0 0 1 18 0M3 12a9 9 0 0 0 18 0" />
                    </svg>
                  }
                  iconBg="bg-blue-50"
                />
                <ProductRow
                  name="Men's Performance T-Shirt"
                  type="Apparel"
                  sold={285}
                  revenue="$10,830"
                  iconPath={
                    <svg className="size-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46L16 2a2 2 0 00-1 .13L12 3.5 9.13 2.13A2 2 0 008 2L3.62 3.46a2 2 0 00-1.34 2.23l.5 3.5a2 2 0 002 1.71h.5a2 2 0 012 2v7.5A2.5 2.5 0 009.78 23h4.44A2.5 2.5 0 0016.72 20.4v-7.52a2 2 0 012-2h.5a2 2 0 002-1.71l.5-3.5a2 2 0 00-1.34-2.21z" />
                    </svg>
                  }
                  iconBg="bg-indigo-50"
                />
                <ProductRow
                  name="Women's Yoga Leggings"
                  type="Apparel"
                  sold={210}
                  revenue="$6,930"
                  iconPath={
                    <svg className="size-4 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 3h14l-1 18H6L5 3z" />
                    </svg>
                  }
                  iconBg="bg-pink-50"
                />
                <ProductRow
                  name="Men's Zip Hoodie"
                  type="Apparel"
                  sold={185}
                  revenue="$9,249"
                  iconPath={
                    <svg className="size-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                    </svg>
                  }
                  iconBg="bg-purple-50"
                />
                <ProductRow
                  name="Men's Training Shorts"
                  type="Apparel"
                  sold={160}
                  revenue="$3,996"
                  iconPath={
                    <svg className="size-4 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 3h16v12H4z M12 3v12" />
                    </svg>
                  }
                  iconBg="bg-teal-50"
                />
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
        <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              View All <FiArrowRight className="size-3" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <tbody className="divide-y divide-slate-50">
                <OrderRow id="#ORD1001" name="John Smith" amount="$120.00" status="Paid" time="10 min ago" />
                <OrderRow id="#ORD1002" name="Emma Wilson" amount="$35.00" status="Paid" time="25 min ago" />
                <OrderRow id="#ORD1003" name="Daniel Lee" amount="$49.99" status="Paid" time="1 hour ago" />
                <OrderRow id="#ORD1004" name="Olivia Brown" amount="$29.99" status="Pending" time="2 hours ago" />
                <OrderRow id="#ORD1005" name="William Harris" amount="$49.98" status="Paid" time="3 hours ago" />
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
  value: string;
  percentage: string;
  trend: "up" | "down";
  color: string;
  iconBg: string;
  Icon: React.ComponentType<{ className?: string }>;
  chartData: number[];
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
          <span className="block text-xl font-bold text-slate-800 leading-tight mt-0.5">
            {value}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 flex-wrap">
        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
          {trend === "up" ? "↑" : "↓"} {percentage}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">vs last week</span>
      </div>
      <div className="mt-3 h-10 -mx-1">
        <ReactApexChart
          options={getSparklineOptions(color)}
          series={[{ data: chartData }]}
          type="area"
          height={40}
        />
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
  iconPath: React.ReactNode;
  iconBg: string;
}

const ProductRow = ({ name, type, sold, revenue, iconPath, iconBg }: ProductRowProps) => {
  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="py-2.5 pr-2">
        <div className="flex items-center gap-2.5">
          <div className={`size-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
            {iconPath}
          </div>
          <div className="min-w-0">
            <span className="block font-semibold text-slate-800 leading-tight truncate">{name}</span>
            <span className="text-[10px] text-slate-400 font-medium">{type}</span>
          </div>
        </div>
      </td>
      <td className="py-2.5 text-right font-semibold text-slate-800">{sold}</td>
      <td className="py-2.5 text-right font-semibold text-slate-800">{revenue}</td>
    </tr>
  );
};

// Subcomponent: OrderRow
interface OrderRowProps {
  id: string;
  name: string;
  amount: string;
  status: "Paid" | "Pending";
  time: string;
}

const OrderRow = ({ id, name, amount, status, time }: OrderRowProps) => {
  const statusClass =
    status === "Paid"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-amber-50 text-amber-700 border-amber-100";

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

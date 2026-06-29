"use client";

import React from "react";
import { FiList, FiClock, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";

interface Props {
  totalLogs: number;
  todayCount: number;
  weekCount: number;
  criticalCount: number;
}

export default function AuditStatsCards(props: Props) {
  return (
    <StatsGrid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Logs" value={props.totalLogs} icon={FiList} color="indigo" sub="All time entries" variant="simple" />
      <StatCard label="Today" value={props.todayCount} icon={FiClock} color="blue" sub="Actions logged today" variant="simple" />
      <StatCard label="This Week" value={props.weekCount} icon={FiCalendar} color="emerald" sub="Last 7 days" variant="simple" />
      <StatCard label="Critical Events" value={props.criticalCount} icon={FiAlertTriangle} color="rose" sub="Requiring attention" variant="simple" />
    </StatsGrid>
  );
}

"use client";

import React from "react";
import { FiUsers, FiUserCheck, FiUserX } from "react-icons/fi";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";

interface Props {
  total: number;
  active: number;
  inactive: number;
}

export default function UserStatsCards(props: Props) {
  return (
    <StatsGrid columns={3}>
      <StatCard label="Total Users" value={props.total} icon={FiUsers} color="indigo" variant="simple" />
      <StatCard label="Active" value={props.active} icon={FiUserCheck} color="emerald" variant="simple" />
      <StatCard label="Inactive" value={props.inactive} icon={FiUserX} color="rose" variant="simple" />
    </StatsGrid>
  );
}

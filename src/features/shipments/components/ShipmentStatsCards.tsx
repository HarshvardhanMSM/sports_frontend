"use client";

import React from "react";
import { FiPackage, FiClock, FiBox, FiTruck, FiNavigation, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import type { ShipmentMetrics } from "@/types/shipment.types";

export default function ShipmentStatsCards(metrics: ShipmentMetrics) {
  return (
    <StatsGrid className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-7">
      <StatCard label="Total Shipments" value={metrics.totalShipments} icon={FiNavigation} color="indigo" variant="simple" />
      <StatCard label="Pending" value={metrics.failedDelivery} icon={FiClock} color="amber" variant="simple" />
      <StatCard label="Packed" value={metrics.packed} icon={FiBox} color="blue" variant="simple" />
      <StatCard label="Ready For Dispatch" value={metrics.dispatched} icon={FiPackage} color="violet" variant="simple" />
      <StatCard label="Out For Delivery" value={metrics.inTransit} icon={FiTruck} color="orange" variant="simple" />
      <StatCard label="Delivered" value={metrics.delivered} icon={FiCheckCircle} color="emerald" variant="simple" />
      <StatCard label="Failed" value={metrics.failed} icon={FiAlertCircle} color="rose" variant="simple" />
    </StatsGrid>
  );
}

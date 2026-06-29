"use client";

import React from "react";
import Badge from "@/components/ui/badge/Badge";

type StatusType = "Active" | "Inactive" | "Draft" | "Published" | "Pending" | "Cancelled" | "Delivered";

const statusColorMap: Record<string, string> = {
  Active: "success",
  Inactive: "error",
  Draft: "warning",
  Published: "success",
  Pending: "warning",
  Cancelled: "error",
  Delivered: "success",
  Yes: "success",
  No: "dark",
};

interface StatusBadgeProps {
  status: StatusType | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColorMap[status] ?? "info";
  return <Badge color={color}>{status}</Badge>;
}

export default StatusBadge;

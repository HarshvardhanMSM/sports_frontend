"use client";

import React from "react";

interface StatsGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export function StatsGrid({ children, columns, className = "" }: StatsGridProps) {
  if (className) {
    return <div className={`grid gap-4 ${className}`}>{children}</div>;
  }
  const cols = columns ?? 3;
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

export default StatsGrid;

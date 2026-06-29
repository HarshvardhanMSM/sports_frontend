"use client";

import React from "react";
import { FiStar, FiThumbsUp } from "react-icons/fi";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import type { ReviewAnalytics } from "@/types/review.types";

interface ReviewAnalyticsCardsProps {
  analytics: ReviewAnalytics | undefined;
  isLoading: boolean;
}

export default function ReviewAnalyticsCards({ analytics, isLoading }: ReviewAnalyticsCardsProps) {
  return (
    <StatsGrid columns={2}>
      <StatCard
        label="Total Reviews"
        value={isLoading || !analytics ? "-" : analytics.totalReviews}
        icon={FiStar}
        color="indigo"
        sub="all time"
      />
      <StatCard
        label="Average Rating"
        value={isLoading || !analytics ? "-" : `${analytics.averageRating.toFixed(1)}★`}
        icon={FiThumbsUp}
        color="violet"
        sub="across all products"
      />
    </StatsGrid>
  );
}

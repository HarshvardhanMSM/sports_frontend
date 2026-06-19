"use client";

import React, { useState } from "react";

export default function ChartTab() {
  const [activeTab, setActiveTab] = useState("monthly");

  return (
    <div className="inline-flex rounded-xl bg-slate-100/70 p-1 gap-1">
      <button
        onClick={() => setActiveTab("monthly")}
        className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
          activeTab === "monthly"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setActiveTab("quarterly")}
        className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
          activeTab === "quarterly"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Quarterly
      </button>
      <button
        onClick={() => setActiveTab("annually")}
        className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
          activeTab === "annually"
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Annually
      </button>
    </div>
  );
}

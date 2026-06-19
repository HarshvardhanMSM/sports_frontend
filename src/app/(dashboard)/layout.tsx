import React from "react";
import { Sidebar } from "@/config/sidebar";
import { Header } from "@/components/Header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
          <div className="mx-auto max-w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

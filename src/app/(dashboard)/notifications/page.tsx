"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiCheck,
  FiTrash2,
  FiRefreshCw,
  FiEye,
  FiShoppingCart,
  FiAlertTriangle,
  FiDatabase,
  FiUser,
  FiInfo,
  FiSearch,
  FiInbox,
  FiArrowRight,
  FiX
} from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";

interface Notification {
  id: string;
  type: "orders" | "inventory" | "system" | "customers";
  title: string;
  description: string;
  details: string;
  time: string;
  isRead: boolean;
  resourcePath?: string;
  resourceLabel?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "orders",
    title: "New order received",
    description: "Order #240546 from John Doe is pending review.",
    details: "Customer John Doe ordered 2x Nike Air Zoom Pegasus 40 and 1x Premium Football Socks. Total amount: $249.99. Payment confirmed via Stripe. Action required: Approve and fulfill the order.",
    time: "2 mins ago",
    isRead: false,
    resourcePath: "/orders",
    resourceLabel: "View Order #240546"
  },
  {
    id: "2",
    type: "inventory",
    title: "Stock alert: Low inventory",
    description: "Runner Shoes size 10 is down to 2 items.",
    details: "Warehouse Zone A, Row 4 reports that 'Air Max Runner - Black/Red' (SKU: RUN-AM-BR-10) has reached its minimum stock threshold. Currently 2 units left. Reorder threshold is set to 5 units.",
    time: "1 hour ago",
    isRead: false,
    resourcePath: "/inventory",
    resourceLabel: "Manage Inventory"
  },
  {
    id: "3",
    type: "system",
    title: "Database backup completed",
    description: "Scheduled daily backup was successful.",
    details: "The automated daily backup of the production database (sports_db_prod_20260630.sql.gz) completed successfully. Total backup size: 1.42 GB. Storage destination: AWS S3 Bucket 'msm-backups' with 99.999% durability.",
    time: "12 hours ago",
    isRead: true
  },
  {
    id: "4",
    type: "customers",
    title: "Suspicious activity detected",
    description: "User 'mark.twain@gmail.com' had multiple card failures.",
    details: "Risk engine detected 4 consecutive card verification failures (CVC mismatch) from IP address 198.51.100.42 within 5 minutes. User account has been temporarily rate-limited for safety.",
    time: "1 day ago",
    isRead: false,
    resourcePath: "/customers",
    resourceLabel: "Review Customer Profile"
  },
  {
    id: "5",
    type: "orders",
    title: "New refund request",
    description: "Refund request #RET-3841 from Alice Smith is open.",
    details: "Customer Alice Smith requested a refund for 'Adidas Predator Accuracy' because of incorrect sizing. Product status: Unworn, with tags intact. Return shipment label was automatically generated.",
    time: "2 days ago",
    isRead: true,
    resourcePath: "/returns",
    resourceLabel: "Manage Returns"
  },
  {
    id: "6",
    type: "system",
    title: "Failed payout attempt",
    description: "Stripe transfer failed for $1,420.00.",
    details: "Stripe payout transaction txn_9423857283 failed due to verification issues with the connected bank account. Please review bank details in the Settings/Stripe dashboard immediately.",
    time: "2 days ago",
    isRead: false,
    resourcePath: "/settings/general",
    resourceLabel: "Payment Settings"
  },
  {
    id: "7",
    type: "inventory",
    title: "Out of Stock: Tennis Rackets",
    description: "Wilson Pro Staff 97 is completely out of stock.",
    details: "Wilson Pro Staff 97 Tennis Rackets (SKU: TEN-WPS-97) is completely out of stock across all locations. Total backorders currently outstanding: 4. Immediate replenishment recommended.",
    time: "3 days ago",
    isRead: true,
    resourcePath: "/inventory",
    resourceLabel: "Check Stock Levels"
  }
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "orders" | "inventory" | "system" | "customers">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  // Tab & search filtering
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab check
      if (activeTab === "unread" && notif.isRead) return false;
      if (activeTab !== "all" && activeTab !== "unread" && notif.type !== activeTab) return false;

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          notif.title.toLowerCase().includes(query) ||
          notif.description.toLowerCase().includes(query) ||
          notif.details.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Actions
  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif((prev) => prev ? { ...prev, isRead: !prev.isRead } : null);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setSelectedNotif(null);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  const restoreDefaults = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  // Get icon for notification type
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "orders":
        return {
          bg: "bg-blue-50 text-blue-600 border border-blue-100",
          icon: <FiShoppingCart className="size-5" />
        };
      case "inventory":
        return {
          bg: "bg-amber-50 text-amber-600 border border-amber-100",
          icon: <FiAlertTriangle className="size-5" />
        };
      case "system":
        return {
          bg: "bg-red-50 text-red-600 border border-red-100",
          icon: <FiDatabase className="size-5" />
        };
      case "customers":
        return {
          bg: "bg-purple-50 text-purple-600 border border-purple-100",
          icon: <FiUser className="size-5" />
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-600 border border-slate-100",
          icon: <FiInfo className="size-5" />
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          badge="System Logs & Actions"
          title="Notifications Center"
          description="Track active store actions, inventory alerts, orders, and system health status."
        />
        {notifications.length < INITIAL_NOTIFICATIONS.length && (
          <button
            onClick={restoreDefaults}
            className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <FiRefreshCw className="size-3.5" />
            Restore Sample Data
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, description or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Global Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all cursor-pointer"
            >
              <FiCheck className="size-3.5" />
              Mark All Read
            </button>
          )}
          {notifications.some((n) => n.isRead) && (
            <button
              onClick={deleteAllRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
            >
              <FiTrash2 className="size-3.5" />
              Clear Read ({notifications.filter((n) => n.isRead).length})
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout: Tabs + List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm space-y-1">
          {[
            { id: "all", label: "All Notifications", count: notifications.length },
            { id: "unread", label: "Unread", count: unreadCount, highlight: true },
            { id: "orders", label: "Orders", count: notifications.filter((n) => n.type === "orders").length },
            { id: "inventory", label: "Inventory", count: notifications.filter((n) => n.type === "inventory").length },
            { id: "customers", label: "Customers", count: notifications.filter((n) => n.type === "customers").length },
            { id: "system", label: "System Alerts", count: notifications.filter((n) => n.type === "system").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : tab.highlight && tab.count > 0
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List Section */}
        <div className="lg:col-span-3 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
              <div className="size-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <FiInbox className="size-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No notifications found</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                {searchQuery
                  ? "No alerts match your current filter parameters or query keyword."
                  : "Hooray! You are all caught up. No pending notifications at the moment."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {filteredNotifications.map((notif) => {
                const style = getIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 transition-all duration-150 hover:bg-slate-50/50 ${
                      !notif.isRead ? "bg-indigo-50/20" : ""
                    }`}
                  >
                    {/* Icon wrapper */}
                    <div className={`p-2.5 rounded-xl shrink-0 ${style.bg}`}>
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          onClick={() => setSelectedNotif(notif)}
                          className={`text-sm font-semibold hover:text-indigo-600 transition-colors cursor-pointer truncate ${
                            !notif.isRead ? "text-slate-800 font-bold" : "text-slate-700"
                          }`}
                        >
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="size-2 rounded-full bg-red-500 shrink-0" />
                        )}
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded ml-auto">
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {notif.time}
                        </span>
                        <div className="h-3 w-px bg-slate-200" />
                        <button
                          onClick={() => setSelectedNotif(notif)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <FiEye className="size-3" />
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-2 self-start">
                      <button
                        onClick={() => toggleReadStatus(notif.id)}
                        className={`size-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                          notif.isRead
                            ? "border-slate-100 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            : "border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        }`}
                        title={notif.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        <FiCheck className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="size-8 rounded-lg flex items-center justify-center border border-slate-100 bg-white text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete notification"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedNotif(null)} />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${getIcon(selectedNotif.type).bg}`}>
                  {getIcon(selectedNotif.type).icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug">
                    {selectedNotif.title}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">
                    {selectedNotif.time} &bull; {selectedNotif.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
              >
                <FiX className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedNotif.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Information</h4>
                <p className="text-xs leading-relaxed text-slate-600 font-mono bg-slate-50/50 p-3 rounded-lg border border-slate-200/60 overflow-y-auto max-h-40 whitespace-pre-line">
                  {selectedNotif.details}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 mt-6 pt-4">
              <button
                onClick={() => toggleReadStatus(selectedNotif.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <FiCheck className="size-4" />
                {selectedNotif.isRead ? "Mark Unread" : "Mark Read"}
              </button>

              <div className="flex items-center gap-2">
                {selectedNotif.resourcePath && (
                  <button
                    onClick={() => {
                      router.push(selectedNotif.resourcePath!);
                      setSelectedNotif(null);
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-100 active:scale-95 transition-all cursor-pointer"
                  >
                    {selectedNotif.resourceLabel || "Go to Details"}
                    <FiArrowRight className="size-3" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(selectedNotif.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <FiTrash2 className="size-4" />
                  Delete Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

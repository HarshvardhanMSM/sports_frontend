"use client";

import React, { useState } from "react";
import { FiBell, FiMail, FiMessageSquare, FiSave, FiRotateCcw } from "react-icons/fi";

type ToggleItem = { label: string; desc: string; key: string };

const ADMIN_TOGGLES: ToggleItem[] = [
  { key: "newOrder", label: "New Order Received", desc: "Get notified when a new order is placed." },
  { key: "orderCancel", label: "Order Cancellation", desc: "Alert when a customer cancels an order." },
  { key: "newReturn", label: "New Return Request", desc: "Notify when a customer submits a return request." },
  { key: "lowStock", label: "Low Stock Alert", desc: "Alert when a product drops below its stock threshold." },
  { key: "outOfStock", label: "Out of Stock Alert", desc: "Notify when a product reaches zero inventory." },
  { key: "newCustomer", label: "New Customer Registration", desc: "Alert when a new customer registers." },
  { key: "paymentFail", label: "Payment Failure", desc: "Notify when a payment fails or is declined." },
  { key: "newReview", label: "New Product Review", desc: "Alert when a customer posts a product review." },
];

const CUSTOMER_EMAIL_TOGGLES: ToggleItem[] = [
  { key: "orderConfirm", label: "Order Confirmation", desc: "Send confirmation email after order placement." },
  { key: "shipConfirm", label: "Shipping Confirmation", desc: "Send tracking info when order is shipped." },
  { key: "deliveryConfirm", label: "Delivery Confirmation", desc: "Notify customer upon delivery." },
  { key: "returnStatus", label: "Return Status Updates", desc: "Email customers about their return/refund status." },
  { key: "passwordReset", label: "Password Reset", desc: "Allow customers to reset their password via email." },
  { key: "wishlistDrop", label: "Wishlist Price Drop", desc: "Alert customer when a wishlisted item goes on sale." },
  { key: "newsletter", label: "Newsletter Opt-in Confirmation", desc: "Send double opt-in email to new subscribers." },
];

const SMS_TOGGLES: ToggleItem[] = [
  { key: "smsShipped", label: "Order Shipped SMS", desc: "Send SMS with tracking number on shipment." },
  { key: "smsOtp", label: "Delivery OTP SMS", desc: "Require OTP verification on delivery." },
  { key: "smsPromo", label: "Promotional SMS Campaigns", desc: "Allow sending marketing SMS to opted-in customers." },
];

const ADMIN_DEFAULTS: Record<string, boolean> = {
  newOrder: true, orderCancel: true, newReturn: true, lowStock: true,
  outOfStock: true, newCustomer: true, paymentFail: true, newReview: false,
};

const EMAIL_DEFAULTS: Record<string, boolean> = {
  orderConfirm: true, shipConfirm: true, deliveryConfirm: true, returnStatus: true,
  passwordReset: true, wishlistDrop: true, newsletter: true,
};

const SMS_DEFAULTS: Record<string, boolean> = {
  smsShipped: false, smsOtp: false, smsPromo: false,
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-indigo-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100" />
    </label>
  );
}

function ToggleRow({ item, checked, onChange }: { item: ToggleItem; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-semibold text-slate-700">{item.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionCard({
  title, description, icon: Icon, iconBg, children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className="size-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 py-1">{children}</div>
      <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3 bg-slate-50/50">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiRotateCcw className="size-3.5" />
          Reset
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiSave className="size-3.5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [adminToggles, setAdminToggles] = useState<Record<string, boolean>>(ADMIN_DEFAULTS);
  const [emailToggles, setEmailToggles] = useState<Record<string, boolean>>(EMAIL_DEFAULTS);
  const [smsToggles, setSmsToggles] = useState<Record<string, boolean>>(SMS_DEFAULTS);

  const toggleAdmin = (key: string) => setAdminToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleEmail = (key: string) => setEmailToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleSms = (key: string) => setSmsToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage email, SMS, and push notification preferences for admins and customers.
        </p>
      </div>

      {/* Admin Notifications */}
      <SectionCard
        title="Admin Notifications"
        description="Real-time alerts sent to admin users for critical store events."
        icon={FiBell}
        iconBg="bg-gradient-to-br from-indigo-500 to-indigo-600"
      >
        {ADMIN_TOGGLES.map((item) => (
          <ToggleRow
            key={item.key}
            item={item}
            checked={adminToggles[item.key]}
            onChange={() => toggleAdmin(item.key)}
          />
        ))}
      </SectionCard>

      {/* Customer Email Notifications */}
      <SectionCard
        title="Customer Email Notifications"
        description="Transactional emails sent automatically to customers."
        icon={FiMail}
        iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
      >
        {CUSTOMER_EMAIL_TOGGLES.map((item) => (
          <ToggleRow
            key={item.key}
            item={item}
            checked={emailToggles[item.key]}
            onChange={() => toggleEmail(item.key)}
          />
        ))}
      </SectionCard>

      {/* SMS Notifications */}
      <SectionCard
        title="SMS Notifications"
        description="SMS alerts for time-sensitive customer communications."
        icon={FiMessageSquare}
        iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
      >
        {SMS_TOGGLES.map((item) => (
          <ToggleRow
            key={item.key}
            item={item}
            checked={smsToggles[item.key]}
            onChange={() => toggleSms(item.key)}
          />
        ))}
        <div className="py-4 border-t border-slate-100 mt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">SMS Provider</label>
          <select
            defaultValue="Disabled"
            className="w-full sm:w-72 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option>Disabled</option>
            <option>Twilio</option>
            <option>Telenor SMS</option>
            <option>Jazz SMS Gateway</option>
          </select>
        </div>
      </SectionCard>
    </div>
  );
}

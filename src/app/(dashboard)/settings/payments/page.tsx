"use client";

import React, { useState } from "react";
import { FiSettings, FiShield, FiCreditCard, FiDollarSign, FiSave, FiRotateCcw } from "react-icons/fi";

interface PaymentMethod {
  name: string;
  icon: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Stripe", icon: "S", description: "Accept credit and debit cards globally with Stripe.", badge: "Recommended", badgeColor: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100" },
  { name: "PayPal", icon: "P", description: "Enable PayPal checkout for worldwide buyers.", badge: "Popular", badgeColor: "bg-blue-50 text-blue-700 ring-1 ring-blue-100" },
  { name: "Cash on Delivery", icon: "C", description: "Allow customers to pay cash on delivery.", badge: "", badgeColor: "" },
  { name: "Bank Transfer", icon: "B", description: "Manual bank transfer with order-hold until payment.", badge: "", badgeColor: "" },
  { name: "JazzCash", icon: "J", description: "Pakistan's leading mobile wallet payment gateway.", badge: "Local", badgeColor: "bg-amber-50 text-amber-700 ring-1 ring-amber-100" },
];

const GATEWAY_ICON_COLORS: Record<string, string> = {
  Stripe: "from-indigo-500 to-violet-600",
  PayPal: "from-blue-500 to-blue-600",
  "Cash on Delivery": "from-emerald-500 to-emerald-600",
  "Bank Transfer": "from-slate-500 to-slate-600",
  JazzCash: "from-amber-500 to-orange-600",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-indigo-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100" />
    </label>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{children}</label>;
}

function FormInput({ hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hint?: string }) {
  return (
    <div>
      <input {...props} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400" />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SectionFooter() {
  return (
    <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3 bg-slate-50/50">
      <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
        <FiRotateCcw className="size-3.5" />
        Reset
      </button>
      <button type="button" className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all" style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}>
        <FiSave className="size-3.5" />
        Save Changes
      </button>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function PaymentsPage() {
  const [gatewayStatus, setGatewayStatus] = useState<Record<string, boolean>>({
    Stripe: true,
    PayPal: true,
    "Cash on Delivery": true,
    "Bank Transfer": false,
    JazzCash: false,
  });
  const [secure3d, setSecure3d] = useState(true);
  const [paymentReceipts, setPaymentReceipts] = useState(true);
  const [storeCardDetails, setStoreCardDetails] = useState(false);

  const toggleGateway = (name: string) => setGatewayStatus((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Methods</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure and manage payment gateways for your store.</p>
      </div>

      {/* Payment Gateways */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <FiCreditCard className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Payment Gateways</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enable or disable payment methods available to customers at checkout.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const isActive = gatewayStatus[method.name];
            return (
              <div
                key={method.name}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                  isActive ? "border-indigo-200 bg-indigo-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${GATEWAY_ICON_COLORS[method.name] ?? "from-slate-400 to-slate-500"} text-white text-sm font-bold shadow-sm`}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{method.name}</p>
                      {method.badge && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${method.badgeColor}`}>
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${
                    isActive ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-slate-200"
                  }`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  <Toggle checked={isActive} onChange={() => toggleGateway(method.name)} />
                  <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 transition-all">
                    <FiSettings className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <SectionFooter />
      </div>

      {/* Stripe Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600">
              <FiShield className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Stripe Configuration</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter your Stripe API credentials to enable card payments.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <FormLabel>Publishable Key</FormLabel>
            <FormInput type="password" placeholder="pk_live_..." hint="Your Stripe publishable key, safe to expose in frontend code." />
          </div>
          <div>
            <FormLabel>Secret Key</FormLabel>
            <FormInput type="password" placeholder="sk_live_..." hint="Keep this key secret. Never expose it in frontend code or version control." />
          </div>
          <div>
            <FormLabel>Webhook Secret</FormLabel>
            <FormInput type="password" placeholder="whsec_..." hint="Used to verify webhook event signatures from Stripe." />
          </div>
          <div>
            <FormLabel>Payment Mode</FormLabel>
            <select defaultValue="Test" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all">
              <option>Test</option>
              <option>Live</option>
            </select>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <ToggleRow label="Enable 3D Secure" desc="Adds an extra security step for card payments." checked={secure3d} onChange={() => setSecure3d(!secure3d)} />
          </div>
        </div>
        <SectionFooter />
      </div>

      {/* General Payment Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <FiDollarSign className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">General Payment Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure order value limits, timeouts, and payment behaviour.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FormLabel>Minimum Order Value ($)</FormLabel>
              <FormInput type="number" defaultValue={10} />
            </div>
            <div>
              <FormLabel>Maximum Order Value ($)</FormLabel>
              <FormInput type="number" defaultValue={10000} />
            </div>
            <div>
              <FormLabel>Payment Timeout (minutes)</FormLabel>
              <FormInput type="number" defaultValue={30} />
            </div>
            <div>
              <FormLabel>Auto-cancel Unpaid Orders After (hours)</FormLabel>
              <FormInput type="number" defaultValue={24} />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2">
            <ToggleRow label="Enable Payment Receipts" desc="Send payment confirmation emails automatically." checked={paymentReceipts} onChange={() => setPaymentReceipts(!paymentReceipts)} />
            <ToggleRow label="Store Card Details" desc="Save card details for returning customers (requires PCI compliance)." checked={storeCardDetails} onChange={() => setStoreCardDetails(!storeCardDetails)} />
          </div>
        </div>
        <SectionFooter />
      </div>
    </div>
  );
}

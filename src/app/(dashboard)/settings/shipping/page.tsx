"use client";

import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMap, FiDollarSign, FiTruck, FiSave, FiRotateCcw } from "react-icons/fi";

interface ShippingZone {
  zone: string;
  regions: string;
  methods: string;
  status: "Active" | "Inactive";
}

const SHIPPING_ZONES: ShippingZone[] = [
  { zone: "Domestic – Karachi", regions: "Karachi", methods: "Standard (1-2 days), Express (Same Day)", status: "Active" },
  { zone: "Domestic – Other Cities", regions: "All Pakistan (excl. Karachi)", methods: "Standard (3-5 days), Express (2-3 days)", status: "Active" },
  { zone: "International – South Asia", regions: "India, Bangladesh, Sri Lanka, Nepal", methods: "Standard (7-14 days)", status: "Active" },
  { zone: "International – Middle East", regions: "UAE, Saudi Arabia, Kuwait, Qatar", methods: "Standard (5-10 days), Express (3-5 days)", status: "Active" },
  { zone: "International – Rest of World", regions: "All other countries", methods: "Standard (10-20 days)", status: "Inactive" },
];

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

export default function ShippingSettingsPage() {
  const [weightPricing, setWeightPricing] = useState(false);
  const [vipFreeShipping, setVipFreeShipping] = useState(true);
  const [autoTracking, setAutoTracking] = useState(true);
  const [requireSignature, setRequireSignature] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipping Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure shipping zones, rates, and delivery options.</p>
      </div>

      {/* Shipping Zones Table */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <FiMap className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Shipping Zones</h2>
              <p className="text-xs text-slate-500 mt-0.5">Define geographic regions and assign shipping methods to each zone.</p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            Add Zone
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Zone Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Countries / Regions</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Shipping Methods</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SHIPPING_ZONES.map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">{row.zone}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-[180px]">{row.regions}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 max-w-[200px]">{row.methods}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                      row.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}>
                      <span className={`size-1.5 rounded-full ${row.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                        <FiEdit2 className="size-3.5" />
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <FiTrash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Shipping Rates */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <FiDollarSign className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Shipping Rates</h2>
              <p className="text-xs text-slate-500 mt-0.5">Set base shipping rates and free shipping thresholds for your store.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FormLabel>Free Shipping Threshold ($)</FormLabel>
              <FormInput type="number" defaultValue={75} hint="Orders above this value receive free shipping." />
            </div>
            <div>
              <FormLabel>Standard Shipping Rate ($)</FormLabel>
              <FormInput type="number" defaultValue={5.99} step="0.01" />
            </div>
            <div>
              <FormLabel>Express Shipping Rate ($)</FormLabel>
              <FormInput type="number" defaultValue={12.99} step="0.01" />
            </div>
            <div>
              <FormLabel>Handling Fee ($)</FormLabel>
              <FormInput type="number" defaultValue={2.0} step="0.01" />
            </div>
            <div>
              <FormLabel>Max Weight per Package (kg)</FormLabel>
              <FormInput type="number" defaultValue={20} />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2">
            <ToggleRow label="Enable Weight-Based Pricing" desc="Calculate shipping cost based on package weight." checked={weightPricing} onChange={() => setWeightPricing(!weightPricing)} />
            <ToggleRow label="Free Shipping for VIP Customers" desc="Automatically waive shipping fees for VIP customer group." checked={vipFreeShipping} onChange={() => setVipFreeShipping(!vipFreeShipping)} />
          </div>
        </div>
        <SectionFooter />
      </div>

      {/* Default Carrier Settings */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <FiTruck className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Default Carrier Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure your primary shipping carrier and tracking preferences.</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <FormLabel>Default Carrier</FormLabel>
            <select defaultValue="TCS Courier" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all">
              <option>TCS Courier</option>
              <option>Leopard Courier</option>
              <option>M&P Express</option>
              <option>DHL Pakistan</option>
            </select>
          </div>
          <div>
            <FormLabel>Tracking URL Template</FormLabel>
            <FormInput type="text" defaultValue="https://www.tcs.com.pk/track?id={trackingNo}" hint="Use {trackingNo} as a placeholder for the order tracking number." />
          </div>
          <div>
            <FormLabel>Estimated Delivery Message</FormLabel>
            <FormInput type="text" defaultValue="Estimated delivery in 3-5 business days." />
          </div>
          <div className="border-t border-slate-100 pt-2">
            <ToggleRow label="Enable Automated Tracking Updates" desc="Send tracking update notifications to customers automatically." checked={autoTracking} onChange={() => setAutoTracking(!autoTracking)} />
            <ToggleRow label="Require Signature on Delivery" desc="Customer must sign to confirm receipt of their order." checked={requireSignature} onChange={() => setRequireSignature(!requireSignature)} />
          </div>
        </div>
        <SectionFooter />
      </div> */}
    </div>
  );
}

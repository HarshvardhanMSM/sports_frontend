"use client";

import React, { useState } from "react";
import { FiGlobe, FiMapPin, FiToggleRight, FiSave, FiRotateCcw } from "react-icons/fi";

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
      {children}
    </label>
  );
}

function FormInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
    />
  );
}

function FormSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
    >
      {children}
    </select>
  );
}

function FormTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-indigo-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100" />
    </label>
  );
}

function SectionCard({ title, description, icon: Icon, iconBg, children, onSave }: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  children: React.ReactNode;
  onSave?: () => void;
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
      <div className="p-6">{children}</div>
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
          onClick={onSave}
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

export default function GeneralSettingsPage() {
  const [storeOnline, setStoreOnline] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [newRegistration, setNewRegistration] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your store&apos;s basic information, locale, and preferences.
        </p>
      </div>

      {/* Store Information */}
      <SectionCard
        title="Store Information"
        description="Basic details that appear on invoices, emails, and the storefront."
        icon={FiGlobe}
        iconBg="bg-gradient-to-br from-indigo-500 to-indigo-600"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FormLabel>Store Name</FormLabel>
              <FormInput type="text" defaultValue="SportswearAdmin" />
            </div>
            <div>
              <FormLabel>Store Email</FormLabel>
              <FormInput type="email" defaultValue="admin@sportswearadmin.com" />
            </div>
            <div>
              <FormLabel>Support Phone</FormLabel>
              <FormInput type="tel" defaultValue="+92 21 1234567" />
            </div>
            <div>
              <FormLabel>Store Website</FormLabel>
              <FormInput type="url" defaultValue="https://sportswearadmin.com" />
            </div>
          </div>
          <div>
            <FormLabel>Store Address</FormLabel>
            <FormTextarea rows={2} defaultValue="123 Sports Avenue, Karachi, Pakistan" />
          </div>
          <div>
            <FormLabel>Store Description</FormLabel>
            <FormTextarea rows={3} defaultValue="Pakistan's leading online sportswear store offering premium athletic footwear, apparel, and accessories." />
          </div>
        </div>
      </SectionCard>

      {/* Regional Settings */}
      <SectionCard
        title="Regional Settings"
        description="Configure locale, currency, and formatting preferences for your store."
        icon={FiMapPin}
        iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FormLabel>Default Currency</FormLabel>
            <FormSelect defaultValue="USD">
              <option value="USD">USD — US Dollar</option>
              <option value="PKR">PKR — Pakistani Rupee</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EUR">EUR — Euro</option>
              <option value="AED">AED — UAE Dirham</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Currency Symbol Position</FormLabel>
            <FormSelect defaultValue="before">
              <option value="before">Before amount (e.g. $100)</option>
              <option value="after">After amount (e.g. 100$)</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Default Language</FormLabel>
            <FormSelect defaultValue="English">
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Timezone</FormLabel>
            <FormSelect defaultValue="UTC+5 (PKT)">
              <option>UTC</option>
              <option>UTC+5 (PKT)</option>
              <option>UTC+1 (BST)</option>
              <option>UTC-5 (EST)</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Date Format</FormLabel>
            <FormSelect defaultValue="DD/MM/YYYY">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Weight Unit</FormLabel>
            <FormSelect defaultValue="kg">
              <option>kg</option>
              <option>lb</option>
              <option>oz</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Dimension Unit</FormLabel>
            <FormSelect defaultValue="cm">
              <option>cm</option>
              <option>inch</option>
            </FormSelect>
          </div>
        </div>
      </SectionCard>

      {/* Store Status */}
      <SectionCard
        title="Store Status"
        description="Control store availability and customer access settings."
        icon={FiToggleRight}
        iconBg="bg-gradient-to-br from-emerald-500 to-emerald-600"
      >
        <div>
          <ToggleRow
            label="Store Online"
            desc="Customers can browse and place orders when enabled."
            checked={storeOnline}
            onChange={() => setStoreOnline(!storeOnline)}
          />
          <ToggleRow
            label="Maintenance Mode"
            desc="Show a maintenance page to all visitors when enabled."
            checked={maintenanceMode}
            onChange={() => setMaintenanceMode(!maintenanceMode)}
          />
          <ToggleRow
            label="Guest Checkout"
            desc="Allow purchases without requiring account registration."
            checked={guestCheckout}
            onChange={() => setGuestCheckout(!guestCheckout)}
          />
          <ToggleRow
            label="New Customer Registration"
            desc="Allow new customers to create accounts on your store."
            checked={newRegistration}
            onChange={() => setNewRegistration(!newRegistration)}
          />
        </div>
      </SectionCard>
    </div>
  );
}

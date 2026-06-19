"use client";

import React, { useState } from "react";
import {
  FiInfo,
  FiServer,
  FiDatabase,
  FiHardDrive,
  FiCopy,
  FiCheck,
  FiAlertTriangle,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

type InfoColor = "indigo" | "blue" | "emerald" | "amber";

interface InfoCard {
  label: string;
  value: string;
  icon: React.ElementType;
  color: InfoColor;
}

const INFO_CARDS: InfoCard[] = [
  { label: "App Version", value: "v2.4.1", icon: FiInfo, color: "indigo" },
  { label: "Node.js Version", value: "v20.11.0", icon: FiServer, color: "blue" },
  { label: "Database", value: "PostgreSQL 15.4", icon: FiDatabase, color: "emerald" },
  { label: "Last Backup", value: "June 15, 2026", icon: FiHardDrive, color: "amber" },
];

const COLOR_MAP: Record<InfoColor, { bg: string; border: string; icon: string }> = {
  indigo: { bg: "bg-indigo-50", border: "border-indigo-100", icon: "text-indigo-600" },
  blue:   { bg: "bg-blue-50",   border: "border-blue-100",   icon: "text-blue-600" },
  emerald:{ bg: "bg-emerald-50",border: "border-emerald-100",icon: "text-emerald-600" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-100",  icon: "text-amber-600" },
};

const API_KEYS = [
  { label: "Store API Key", value: "sk_prod_••••••••••••AbCd1234" },
  { label: "Webhook Signing Secret", value: "whsec_••••••••••••XyZ9876" },
  { label: "Internal Dev Token", value: "dev_tk_••••••••••••Dev0001" },
];

export default function SystemPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [pageCache, setPageCache] = useState(true);
  const [apiCache, setApiCache] = useState(true);
  const [imageOptimize, setImageOptimize] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [includeMedia, setIncludeMedia] = useState(false);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Configuration</h1>
          <p className="text-sm text-slate-500">Advanced system settings, API keys, cache management, and diagnostics.</p>
        </div>
      </div>

      {/* Section 1: System Information */}
      <div>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-slate-800">System Information</h2>
          <p className="text-sm text-slate-500 mt-0.5">Read-only overview of the current runtime environment.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {INFO_CARDS.map((card) => {
            const colors = COLOR_MAP[card.color];
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg} border ${colors.border}`}>
                  <Icon className={`size-5 ${colors.icon}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: API Keys */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">API Keys</h2>
          <p className="text-sm text-slate-500 mt-0.5">Store API credentials — keep these confidential and never share publicly.</p>
        </div>
        <div className="p-6 space-y-4">
          {API_KEYS.map((k) => (
            <div key={k.label} className="flex items-center gap-3">
              <div className="w-48 shrink-0">
                <p className="text-sm font-semibold text-slate-700">{k.label}</p>
              </div>
              <div className="flex-1 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 truncate">
                {k.value}
              </div>
              <button
                onClick={() => handleCopy(k.label, k.value)}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Copy to clipboard"
              >
                {copied === k.label ? (
                  <FiCheck className="size-4 text-emerald-500" />
                ) : (
                  <FiCopy className="size-4" />
                )}
              </button>
            </div>
          ))}
          <div className="pt-2">
            <button className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <FiRefreshCw className="size-4" />
              Regenerate All Keys
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Cache Management */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Cache Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Control caching layers and expiry settings for improved performance.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">Enable Page Cache</p>
                <p className="text-xs text-slate-400 mt-0.5">Cache rendered pages for faster load times.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={pageCache} onChange={() => setPageCache(!pageCache)} className="sr-only peer" />
                <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">Enable API Response Cache</p>
                <p className="text-xs text-slate-400 mt-0.5">Cache API responses to reduce database load.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={apiCache} onChange={() => setApiCache(!apiCache)} className="sr-only peer" />
                <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Enable Image Optimization</p>
                <p className="text-xs text-slate-400 mt-0.5">Compress and resize images automatically.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={imageOptimize} onChange={() => setImageOptimize(!imageOptimize)} className="sr-only peer" />
                <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cache TTL (seconds)</label>
            <input
              type="number"
              defaultValue={3600}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all sm:w-64"
            />
            <p className="mt-1 text-xs text-slate-400">Time before cached content expires.</p>
          </div>

          <div className="pt-1">
            <button className="flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors">
              <FiTrash2 className="size-4" />
              Clear All Caches
            </button>
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Reset</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>

      {/* Section 4: Maintenance & Backup */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Maintenance &amp; Backup</h2>
          <p className="text-sm text-slate-500 mt-0.5">Schedule automated backups and configure backup storage.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Backup Frequency</label>
              <select
                defaultValue="Daily"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white hover:bg-slate-50"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Backup Retention</label>
              <select
                defaultValue="30 days"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white hover:bg-slate-50"
              >
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Backup Storage</label>
              <select
                defaultValue="AWS S3"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white hover:bg-slate-50"
              >
                <option>Local</option>
                <option>AWS S3</option>
                <option>Google Cloud Storage</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">Auto Backup</p>
                <p className="text-xs text-slate-400 mt-0.5">Automatically run backups on the configured schedule.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={autoBackup} onChange={() => setAutoBackup(!autoBackup)} className="sr-only peer" />
                <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Include Media Files in Backup</p>
                <p className="text-xs text-slate-400 mt-0.5">Media files can be large. Enable only if needed.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={includeMedia} onChange={() => setIncludeMedia(!includeMedia)} className="sr-only peer" />
                <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Reset</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm">
        <div className="border-b border-red-100 px-6 py-4 bg-red-50/50 rounded-t-xl flex items-center gap-2.5">
          <FiAlertTriangle className="size-5 text-red-500 shrink-0" />
          <div>
            <h2 className="text-base font-semibold text-red-700">Danger Zone</h2>
            <p className="text-sm text-red-500 mt-0.5">These actions are irreversible. Proceed with caution.</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Clear All Logs */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Clear All Logs</p>
              <p className="text-xs text-slate-500 mt-0.5">Permanently delete all audit logs. This cannot be undone.</p>
            </div>
            <button className="shrink-0 ml-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              Clear Logs
            </button>
          </div>
          <div className="border-t border-red-50" />
          {/* Reset to Default */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Reset to Default Settings</p>
              <p className="text-xs text-slate-500 mt-0.5">Revert all system settings to factory defaults.</p>
            </div>
            <button className="shrink-0 ml-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              Reset Settings
            </button>
          </div>
          <div className="border-t border-red-50" />
          {/* Delete All Customer Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Delete All Customer Data</p>
              <p className="text-xs text-slate-500 mt-0.5">Permanently delete all customer accounts and data. GDPR compliance.</p>
            </div>
            <button className="shrink-0 ml-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              Delete Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

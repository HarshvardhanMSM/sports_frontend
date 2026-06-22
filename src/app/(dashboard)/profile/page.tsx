"use client";

import React, { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiUser,
  FiShield,
  FiKey,
  FiMail,
  FiLock,
  FiCheck,
  FiCopy,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiSave,
} from "react-icons/fi";
import { useCurrentUser, useUpdateUser } from "@/hooks/useUsers";
import { useResetAdminPassword } from "@/hooks/useRoles";
import { useLogout } from "@/hooks/useAuth";


/* ─── Helpers ─────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** "products.read" → { module: "Products", action: "Read" } */
function parsePerm(perm: string) {
  const parts = perm.split(".");
  const module = parts[0]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? perm;
  const action = parts[1]?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";
  return { module, action };
}

const ACTION_COLORS: Record<string, string> = {
  Read:    "bg-blue-50 text-blue-700 ring-blue-200",
  Write:   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Create:  "bg-violet-50 text-violet-700 ring-violet-200",
  Update:  "bg-amber-50 text-amber-700 ring-amber-200",
  Delete:  "bg-rose-50 text-rose-700 ring-rose-200",
  Manage:  "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const AVATAR_GRADIENT = "from-indigo-500 via-violet-500 to-purple-600";

/* ─── Sub-components ─────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      title="Copy"
      className="ml-1.5 text-slate-400 hover:text-slate-600 transition-colors"
    >
      {copied ? <FiCheck className="size-3.5 text-emerald-500" /> : <FiCopy className="size-3.5" />}
    </button>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {children}
    </label>
  );
}


/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useCurrentUser();
  const logout = useLogout();
  const updateUserMutation = useUpdateUser();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const profile =
    !Array.isArray(raw) && raw && typeof raw === "object" && "id" in raw
      ? (raw as {
          id: string;
          name: string;
          email: string;
          avatar?: string;
          roles: { id: string; name: string }[];
          permissions: string[];
        })
      : null;

  const resetPasswordMutation = useResetAdminPassword(profile?.id ?? "");

  // Master layout tabs: permissions, edit-profile, change-password
  const [activeTab, setActiveTab] = useState<"permissions" | "edit-profile" | "change-password">("permissions");
  
  // Permissions tab view & search states
  const [permSearch, setPermSearch] = useState("");
  const [permView, setPermView] = useState<"grid" | "list">("grid");

  // Edit Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  // Change Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setAvatar(profile.avatar || "");
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await updateUserMutation.mutateAsync({
        id: profile.id,
        name,
        email,
        avatar: avatar || undefined,
      });
      showToast("success", "Profile updated successfully!");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update profile.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync(newPassword);
      showToast("success", "Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to change password.");
    }
  };

  const initials = profile ? getInitials(profile.name) : "?";

  // Guard: some APIs return non-string values in permissions array
  const safePerms: string[] = (profile?.permissions ?? []).filter(
    (p): p is string => typeof p === "string"
  );

  const filteredPerms = safePerms.filter((p) =>
    p.toLowerCase().includes(permSearch.toLowerCase())
  );

  // Group permissions by module
  const groupedPerms = filteredPerms.reduce<Record<string, string[]>>((acc, perm) => {
    const { module } = parsePerm(perm);
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {});


  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="size-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <FiAlertCircle className="size-7 text-rose-500" />
        </div>
        <p className="text-base font-bold text-slate-800">Failed to load profile</p>
        <p className="text-sm text-slate-500 mt-1">Please try again later.</p>
        <button
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiRefreshCw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  /* ── Not found ── */
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FiUser className="size-7 text-slate-400" />
        </div>
        <p className="text-base font-bold text-slate-800">Profile not found</p>
        <p className="text-sm text-slate-500 mt-1">Unable to load your profile information.</p>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] rounded-xl px-5 py-3 shadow-xl text-sm font-semibold text-white transition-all animate-slideIn ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Account</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">View your profile, roles, and edit your details or security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ═══ LEFT COLUMN ══════════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* Avatar card */}
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header gradient strip */}
            <div className={`h-24 bg-gradient-to-r ${AVATAR_GRADIENT}`} />

            <div className="px-6 pb-6 -mt-12 text-center">
              {/* Avatar */}
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="size-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                />
              ) : (
                <div
                  className={`size-24 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-3xl font-extrabold text-white border-4 border-white shadow-lg mx-auto`}
                >
                  {initials}
                </div>
              )}

              <h2 className="text-xl font-extrabold text-slate-900 mt-4 tracking-tight">{profile.name}</h2>

              {/* Email row */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <FiMail className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-500">{profile.email}</span>
                <CopyButton text={profile.email} />
              </div>

              {/* ID row */}
              <div className="flex items-center justify-center gap-1 mt-1">
                <FiKey className="size-3.5 text-slate-400 shrink-0" />
                <span className="text-xs font-mono text-slate-400">{profile.id.slice(0, 16)}…</span>
                <CopyButton text={profile.id} />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Roles */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Assigned Roles
              </h3>
              {profile.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.roles.map((r) => (
                    <span
                      key={r.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm"
                    >
                      <FiShield className="size-3" />
                      {r.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No roles assigned.</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Roles"
              value={profile.roles.length}
              color="text-indigo-600"
            />
            <StatCard
              label="Permissions"
              value={safePerms.length}
              color="text-violet-600"
            />
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Session</h3>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-all disabled:opacity-50"
            >
              <FiLock className="size-4" />
              {logout.isPending ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab selector bar */}
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("permissions")}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "permissions"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FiKey className="size-3.5" />
              Permissions
            </button>
            <button
              onClick={() => setActiveTab("edit-profile")}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "edit-profile"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FiUser className="size-3.5" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("change-password")}
              className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "change-password"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FiLock className="size-3.5" />
              Security
            </button>
          </div>

          {/* ACTIVE TAB: Permissions */}
          {activeTab === "permissions" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
              {/* Card header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Permissions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All access rights granted through your roles.
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search permissions…"
                      value={permSearch}
                      onChange={(e) => setPermSearch(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 w-48 transition-all"
                    />
                  </div>
                  {/* View toggle */}
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setPermView("grid")}
                      className={`px-3 py-2 text-xs font-semibold transition-colors ${permView === "grid" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setPermView("list")}
                      className={`px-3 py-2 text-xs font-semibold transition-colors border-l border-slate-200 ${permView === "list" ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {safePerms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                      <FiKey className="size-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No permissions assigned</p>
                    <p className="text-xs text-slate-400 mt-1">Contact an admin to assign roles.</p>
                  </div>
                ) : filteredPerms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm font-semibold text-slate-500">No permissions match "{permSearch}"</p>
                  </div>
                ) : permView === "grid" ? (
                  /* ── Grid view: group by module ── */
                  <div className="space-y-5">
                    {Object.entries(groupedPerms)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([module, perms]) => (
                        <div key={module}>
                          <div className="flex items-center gap-2 mb-2">
                            <FiShield className="size-3.5 text-indigo-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              {module}
                            </span>
                            <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {perms.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {perms.map((perm) => {
                              const { action } = parsePerm(perm);
                              const colorClass =
                                ACTION_COLORS[action] ?? "bg-slate-100 text-slate-600 ring-slate-200";
                              return (
                                <span
                                  key={perm}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ${colorClass}`}
                                  title={perm}
                                >
                                  {action || perm}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  /* ── List view ── */
                  <div className="divide-y divide-slate-100 -mx-6 -mb-6">
                    {filteredPerms
                      .slice()
                      .sort()
                      .map((perm) => {
                        const { module, action } = parsePerm(perm);
                        const colorClass =
                          ACTION_COLORS[action] ?? "bg-slate-100 text-slate-600 ring-slate-200";
                        return (
                          <div
                            key={perm}
                            className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FiKey className="size-3.5 text-slate-400 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-slate-700">{module}</p>
                                <p className="text-[10px] font-mono text-slate-400">{perm}</p>
                              </div>
                            </div>
                            {action && (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ${colorClass}`}
                              >
                                {action}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE TAB: Edit Profile */}
          {activeTab === "edit-profile" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-extrabold text-slate-900">Edit Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display name, email, and avatar picture.
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image preview / Initials */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <FormLabel>Avatar Preview</FormLabel>
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="Preview"
                          className="size-24 rounded-2xl object-cover border border-slate-200 shadow-inner"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className={`size-24 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-3xl font-extrabold text-white border border-slate-200 shadow-inner`}
                        >
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <FormLabel>Full Name</FormLabel>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <FormLabel>Email Address</FormLabel>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your-email@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <FormLabel>Avatar Image URL</FormLabel>
                        <input
                          type="url"
                          value={avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          placeholder="https://example.com/your-image.jpg"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setName(profile.name || "");
                        setEmail(profile.email || "");
                        setAvatar(profile.avatar || "");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={updateUserMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
                    >
                      <FiSave className="size-3.5" />
                      {updateUserMutation.isPending ? "Saving..." : "Save Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: Change Password */}
          {activeTab === "change-password" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-extrabold text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure your account by updating your password.
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <input
                          type={showNewPass ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <FormLabel>Confirm New Password</FormLabel>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPass ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={resetPasswordMutation.isPending || !newPassword || !confirmPassword}
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
                    >
                      <FiLock className="size-3.5" />
                      {resetPasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiAlertCircle,
  FiUser,
  FiShield,
  FiMail,
  FiLock,
  FiCheck,
  FiCopy,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiSave,
  FiUpload,
  FiCamera,
  FiLogOut,
} from "react-icons/fi";
import {
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/useUsers";
import { useLogout } from "@/hooks/useAuth";
import { resolveImageUrl } from "@/lib/image";

/* ─── Helpers ─────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENT = "from-indigo-600 via-violet-600 to-pink-500";

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
      title="Copy to clipboard"
      className="ml-1.5 p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
    >
      {copied ? <FiCheck className="size-3.5 text-emerald-500" /> : <FiCopy className="size-3.5" />}
    </button>
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
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const raw = (data as unknown as Record<string, unknown>)?.data ?? data;
  const profile =
    !Array.isArray(raw) && raw && typeof raw === "object" && "id" in raw
      ? (raw as {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        mobile?: string;
        roles: { id: string; name: string }[];
        permissions: string[];
      })
      : null;

  // Master layout tabs: edit-profile, change-password
  const [activeTab, setActiveTab] = useState<"edit-profile" | "change-password">("edit-profile");

  // Edit Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [profileFormLoaded, setProfileFormLoaded] = useState(false);
  if (profile && !profileFormLoaded) {
    setProfileFormLoaded(true);
    setName(profile.name || "");
    setEmail(profile.email || "");
    setAvatar(profile.avatar || "");
  }

  // Change Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await updateProfileMutation.mutateAsync({
        name,
        email,
        avatarFile: avatarFile || undefined,
      });
      showToast("success", "Profile updated successfully!");
      setAvatarFile(null);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update profile.");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Avatar size cannot exceed 2MB.");
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatar((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return previewUrl;
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: oldPassword,
        newPassword,
      });
      showToast("success", "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to change password.");
    }
  };

  const initials = profile ? getInitials(profile.name) : "?";

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="size-12 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">Loading secure profile...</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg mx-auto">
        <div className="size-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5 shadow-inner">
          <FiAlertCircle className="size-8 text-rose-500" />
        </div>
        <p className="text-lg font-bold text-slate-800">Failed to load profile</p>
        <p className="text-sm text-slate-500 mt-1.5 text-center px-6">There was an issue fetching your account details. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95 duration-200"
        >
          <FiRefreshCw className="size-4 animate-spin-slow" />
          Retry Connection
        </button>
      </div>
    );
  }

  /* ── Not found ── */
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg mx-auto">
        <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
          <FiUser className="size-8 text-slate-400" />
        </div>
        <p className="text-lg font-bold text-slate-800">Profile not found</p>
        <p className="text-sm text-slate-500 mt-1.5 text-center px-6">Unable to load your profile information. Ensure you are authenticated.</p>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] rounded-2xl px-5 py-3.5 shadow-2xl text-sm font-semibold text-white transition-all duration-300 animate-slideIn flex items-center gap-2 border border-white/10 ${toast.type === "success"
              ? "bg-emerald-600 shadow-emerald-100"
              : "bg-rose-600 shadow-rose-100"
            }`}
        >
          {toast.type === "success" ? <FiCheck className="size-4" /> : <FiAlertCircle className="size-4" />}
          {toast.message}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Account Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile details, security settings, and global credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ═══ LEFT COLUMN (Overview Card) ═══════════════════════════════════ */}
        <div className="space-y-8 lg:col-span-1">
          {/* Main User Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
            {/* Header premium gradient strip */}
            <div className={`h-32 bg-gradient-to-r ${AVATAR_GRADIENT} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              {/* Subtle background circles for depth */}
              <div className="absolute -top-12 -left-12 size-32 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-8 -right-8 size-36 rounded-full bg-white/20 blur-lg" />
            </div>

            <div className="px-6 pb-6 -mt-16 text-center relative z-10">
              {/* Interactive Avatar Container */}
              <div className="relative size-28 mx-auto rounded-3xl overflow-hidden border-[6px] border-white shadow-xl bg-slate-50 transition-transform duration-300 group-hover:scale-102">
                {profile.avatar ? (
                  <img
                    src={resolveImageUrl(profile.avatar)}
                    alt={profile.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div
                    className={`size-full bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-4xl font-extrabold text-white`}
                  >
                    {initials}
                  </div>
                )}
              </div>

              {/* Identity Info */}
              <h2 className="text-2xl font-extrabold text-slate-900 mt-5 tracking-tight">{profile.name}</h2>

              <div className="inline-flex items-center justify-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors duration-200">
                <FiMail className="size-3.5 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">{profile.email}</span>
                <CopyButton text={profile.email} />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Roles Section */}
            <div className="px-6 py-5 bg-slate-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FiShield className="size-3 text-slate-400" />
                Assigned Roles
              </h3>
              {profile.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.roles.map((r) => (
                    <span
                      key={r.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100/50 shadow-sm"
                    >
                      <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      {r.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No administrative roles assigned.</p>
              )}
            </div>
          </div>

          {/* Session Safety Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Session Security</h3>
              <p className="text-xs text-slate-400">
                Manage your active administrator login session. Keep your credentials private.
              </p>
            </div>
            <button
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 hover:text-rose-700 shadow-sm hover:shadow transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <FiLogOut className="size-4" />
              {logout.isPending ? "Signing out…" : "Sign Out Account"}
            </button>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN (Interactive Form Panel) ═══════════════════════ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Tab Panel */}
          <div className="flex p-1.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm gap-2">
            <button
              onClick={() => setActiveTab("edit-profile")}
              className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${activeTab === "edit-profile"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
            >
              <FiUser className="size-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("change-password")}
              className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${activeTab === "change-password"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
            >
              <FiLock className="size-4" />
              Security Settings
            </button>
          </div>

          {/* Tab 1: Edit Profile details */}
          {activeTab === "edit-profile" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-fadeIn duration-300">
              <div className="border-b border-slate-100 px-6 py-5 bg-slate-50/20">
                <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Update your display profile image, administrative name, and official email address.
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Modern Hoverable Avatar Upload Widget */}
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <FormLabel>Avatar Photo</FormLabel>

                      {/* Avatar container with interactive hover state */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative size-28 rounded-3xl overflow-hidden border border-slate-200 shadow-md group/avatar cursor-pointer bg-slate-50"
                      >
                        {avatar ? (
                          <img
                            src={resolveImageUrl(avatar)}
                            alt="Avatar preview"
                            className="size-full object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                          />
                        ) : (
                          <div
                            className={`size-full bg-gradient-to-br ${AVATAR_GRADIENT} flex items-center justify-center text-4xl font-extrabold text-white transition-transform duration-300 group-hover/avatar:scale-105`}
                          >
                            {initials}
                          </div>
                        )}
                        {/* Semi-transparent black glass overlay on hover */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
                          <FiCamera className="size-6 text-white" />
                          <span className="text-[10px] text-white font-bold uppercase tracking-wider">Upload</span>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                      >
                        <FiUpload className="size-3 text-slate-500" />
                        Choose File
                      </button>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP. Max 2MB.</span>
                    </div>

                    {/* Text Inputs */}
                    <div className="flex-1 w-full space-y-5">
                      <div>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <FiUser className="size-4 text-slate-400" />
                          </div>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <FiMail className="size-4 text-slate-400" />
                          </div>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your-email@example.com"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setName(profile.name || "");
                        setEmail(profile.email || "");
                        setAvatar(profile.avatar || "");
                        setAvatarFile(null);
                      }}
                      className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer active:scale-98"
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                      <FiSave className="size-4" />
                      {updateProfileMutation.isPending ? "Saving Details..." : "Save Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Change Password */}
          {activeTab === "change-password" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-fadeIn duration-300">
              <div className="border-b border-slate-100 px-6 py-5 bg-slate-50/20">
                <h2 className="text-lg font-bold text-slate-900">Security Credentials</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enhance your account safety by setting a new strong password.
                </p>
              </div>
              <div className="p-6">
                {/* Security tip box */}
                <div className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex gap-3">
                  <FiAlertCircle className="size-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-950/80 leading-relaxed">
                    <span className="font-bold text-indigo-900">Password Requirements:</span> Your new password must be at least 6 characters long. For optimal security, combine letters, numbers, and symbols.
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-5">
                    <div>
                      <FormLabel>Current Password</FormLabel>
                      <div className="relative max-w-lg">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <FiLock className="size-4 text-slate-400" />
                        </div>
                        <input
                          type={showOldPass ? "text" : "password"}
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter your current password"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          {showOldPass ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <FormLabel>New Password</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <FiLock className="size-4 text-slate-400" />
                          </div>
                          <input
                            type={showNewPass ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            {showNewPass ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <FormLabel>Confirm New Password</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <FiLock className="size-4 text-slate-400" />
                          </div>
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            {showConfirmPass ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer active:scale-98"
                    >
                      Clear Fields
                    </button>
                    <button
                      type="submit"
                      disabled={changePasswordMutation.isPending || !oldPassword || !newPassword || !confirmPassword}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 active:scale-98 disabled:opacity-50 cursor-pointer"
                    >
                      <FiLock className="size-4" />
                      {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
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

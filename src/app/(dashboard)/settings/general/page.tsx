"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FiSave,
  FiImage,
  FiUpload,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiGlobe,
  FiLink,
  FiMail,
  FiBriefcase,
  FiCreditCard,
  FiRotateCcw,
} from "react-icons/fi";
import {
  useStoreSettings,
  useUpdateStoreSettings,
  useUploadLogo,
  useUploadFavicon,
} from "@/hooks/useStoreSettings";
import { useSocialLinks, useUpdateSocialLinks } from "@/hooks/useSocialLinks";
import { useEmailSettings, useUpdateEmailSettings } from "@/hooks/useEmailSettings";
import { useBusinessSettings, useUpdateBusinessSettings } from "@/hooks/useBusinessSettings";
import { getImageUrl } from "@/lib/utils";

// ── SHARED FORM FIELD UTILS ───────────────────────────────────────

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

function FormTextarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
    />
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  iconBg,
  children,
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
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── STORE BRANDING SUB-COMPONENTS ─────────────────────────────────

function ImagePreviewCard({
  title,
  imageUrl,
  onUpload,
}: {
  title: string;
  imageUrl: string | null | undefined;
  onUpload: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50">
            <FiImage className="size-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a new {title.toLowerCase()} image
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
          {imageUrl ? (
            <img src={getImageUrl(imageUrl)} alt={title} className="w-full h-full object-contain" />
          ) : (
            <FiImage className="size-10 text-slate-300" />
          )}
        </div>
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <FiUpload className="size-3.5" />
          Upload {title}
        </button>
      </div>
    </div>
  );
}

function UploadModal({
  title,
  onClose,
  onUpload,
  isPending,
}: {
  title: string;
  onClose: () => void;
  onUpload: (file: File) => void;
  isPending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelected(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Upload {title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <FiX className="size-5" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-contain" />
            ) : (
              <FiImage className="size-12 text-slate-300" />
            )}
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Choose File
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => selected && onUpload(selected)}
            disabled={!selected || isPending}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SCHEMAS & PLATFORMS ──────────────────────────────────────────

const storeFormSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeTagline: z.string().optional(),
  storeEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  // latitude: z.string().optional(),
  // longitude: z.string().optional(),
});
type StoreFormValues = z.infer<typeof storeFormSchema>;

const businessFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  cinNumber: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});
type BusinessFormValues = z.infer<typeof businessFormSchema>;

const emailFormSchema = z.object({
  fromName: z.string().min(1, "Sender name is required"),
  fromEmail: z.string().email("Invalid email address"),
  replyToEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});
type EmailFormValues = z.infer<typeof emailFormSchema>;

const socialFormSchema = z.object({
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  whatsapp: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid URL").optional().or(z.literal("")),
  telegram: z.string().url("Invalid URL").optional().or(z.literal("")),
});
type SocialFormValues = z.infer<typeof socialFormSchema>;

const PLATFORMS: {
  key: keyof SocialFormValues;
  label: string;
  placeholder: string;
  color: string;
}[] = [
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/yourpage",
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/yourhandle",
      color: "bg-pink-100 text-pink-600",
    },
    {
      key: "twitter",
      label: "Twitter / X",
      placeholder: "https://twitter.com/yourhandle",
      color: "bg-sky-100 text-sky-600",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/yourprofile",
      color: "bg-blue-100 text-blue-700",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      placeholder: "https://wa.me/1234567890",
      color: "bg-green-100 text-green-600",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "https://youtube.com/@yourchannel",
      color: "bg-red-100 text-red-600",
    },
    {
      key: "telegram",
      label: "Telegram",
      placeholder: "https://t.me/yourhandle",
      color: "bg-sky-100 text-sky-700",
    },
  ];

const TABS = [
  { id: "store", label: "Store Details", icon: FiGlobe },
  { id: "business", label: "Business Details", icon: FiBriefcase },
  { id: "email", label: "Email Config", icon: FiMail },
  { id: "social", label: "Social Links", icon: FiLink },
] as const;

// ── MAIN PAGE COMPONENT ──────────────────────────────────────────

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState<"store" | "business" | "email" | "social">("store");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Store settings queries & mutations
  const storeQuery = useStoreSettings();
  const updateStore = useUpdateStoreSettings();
  const uploadLogo = useUploadLogo();
  const uploadFavicon = useUploadFavicon();
  const [logoModal, setLogoModal] = useState(false);
  const [faviconModal, setFaviconModal] = useState(false);

  // Social Links queries & mutations
  const socialQuery = useSocialLinks();
  const updateSocial = useUpdateSocialLinks();
  const [openSocialSections, setOpenSocialSections] = useState<Record<string, boolean>>({});

  // Email Config queries & mutations
  const emailQuery = useEmailSettings();
  const updateEmail = useUpdateEmailSettings();

  // Business settings queries & mutations
  const businessQuery = useBusinessSettings();
  const updateBusiness = useUpdateBusinessSettings();

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Forms setup
  const storeForm = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    values: {
      storeName: storeQuery.data?.storeName ?? "",
      storeTagline: storeQuery.data?.storeTagline ?? "",
      storeEmail: storeQuery.data?.storeEmail ?? "",
      phone: storeQuery.data?.phone ?? "",
      addressLine1: storeQuery.data?.addressLine1 ?? "",
      // latitude: storeQuery.data?.latitude ?? "",
      // longitude: storeQuery.data?.longitude ?? "",
    },
  });

  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    values: {
      companyName: businessQuery.data?.companyName ?? "",
      gstNumber: businessQuery.data?.gstNumber ?? "",
      panNumber: businessQuery.data?.panNumber ?? "",
      cinNumber: businessQuery.data?.cinNumber ?? "",
      bankName: businessQuery.data?.bankName ?? "",
      accountNumber: businessQuery.data?.accountNumber ?? "",
      ifscCode: businessQuery.data?.ifscCode ?? "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    values: {
      fromName: emailQuery.data?.fromName ?? "",
      fromEmail: emailQuery.data?.fromEmail ?? "",
      replyToEmail: emailQuery.data?.replyToEmail ?? "",
    },
  });

  const socialForm = useForm<SocialFormValues>({
    resolver: zodResolver(socialFormSchema),
    values: {
      facebook: socialQuery.data?.facebook ?? "",
      instagram: socialQuery.data?.instagram ?? "",
      twitter: socialQuery.data?.twitter ?? "",
      linkedin: socialQuery.data?.linkedin ?? "",
      whatsapp: socialQuery.data?.whatsapp ?? "",
      youtube: socialQuery.data?.youtube ?? "",
      telegram: socialQuery.data?.telegram ?? "",
    },
  });

  // Submit handlers
  const onStoreSubmit = async (formData: StoreFormValues) => {
    try {
      await updateStore.mutateAsync(formData);
      showToast("success", "Store settings saved successfully");
    } catch {
      showToast("error", "Failed to save store settings");
    }
  };

  const onBusinessSubmit = async (formData: BusinessFormValues) => {
    try {
      await updateBusiness.mutateAsync(formData);
      showToast("success", "Business information saved successfully");
    } catch {
      showToast("error", "Failed to save business information");
    }
  };

  const onEmailSubmit = async (formData: EmailFormValues) => {
    try {
      await updateEmail.mutateAsync(formData);
      showToast("success", "Email settings saved successfully");
    } catch {
      showToast("error", "Failed to save email settings");
    }
  };

  const onSocialSubmit = async (formData: SocialFormValues) => {
    try {
      await updateSocial.mutateAsync(formData);
      showToast("success", "Social links saved successfully");
    } catch {
      showToast("error", "Failed to save social links");
    }
  };

  const handleRetry = () => {
    storeQuery.refetch();
    businessQuery.refetch();
    emailQuery.refetch();
    socialQuery.refetch();
  };

  // Loading state
  const isLoading =
    storeQuery.isLoading ||
    businessQuery.isLoading ||
    emailQuery.isLoading ||
    socialQuery.isLoading;

  // Error state
  const isError =
    storeQuery.isError ||
    businessQuery.isError ||
    emailQuery.isError ||
    socialQuery.isError;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
        {/* Tabs Skeleton */}
        <div className="flex gap-2 border-b border-slate-100 pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-slate-100 rounded-xl" />
          ))}
        </div>
        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-6 w-36 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 mb-4">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load settings data.</p>
        </div>
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer"
        >
          <FiRefreshCw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-5 w-1 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Configuration
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your store details, branding, business credentials, email templates, and social profiles.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-150 -mb-px cursor-pointer ${isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {/* Tab 1: Store Settings */}
        {activeTab === "store" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImagePreviewCard
                title="Logo"
                imageUrl={storeQuery.data?.logoUrl}
                onUpload={() => setLogoModal(true)}
              />
              <ImagePreviewCard
                title="Favicon"
                imageUrl={storeQuery.data?.faviconUrl}
                onUpload={() => setFaviconModal(true)}
              />
            </div>

            <SectionCard
              title="Store Information"
              description="Update your store branding, location details, and support contacts."
              icon={FiGlobe}
              iconBg="bg-indigo-500"
            >
              <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <FormLabel>Store Name</FormLabel>
                    <FormInput {...storeForm.register("storeName")} placeholder="My Store" />
                    {storeForm.formState.errors.storeName && (
                      <p className="text-xs text-red-500 mt-1">
                        {storeForm.formState.errors.storeName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel>Store Tagline</FormLabel>
                    <FormInput
                      {...storeForm.register("storeTagline")}
                      placeholder="Best products online"
                    />
                  </div>
                  <div>
                    <FormLabel>Store Email</FormLabel>
                    <FormInput
                      {...storeForm.register("storeEmail")}
                      type="email"
                      placeholder="store@example.com"
                    />
                    {storeForm.formState.errors.storeEmail && (
                      <p className="text-xs text-red-500 mt-1">
                        {storeForm.formState.errors.storeEmail.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel>Store Phone</FormLabel>
                    <FormInput
                      {...storeForm.register("phone")}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                <div>
                  <FormLabel>Store Address</FormLabel>
                  <FormTextarea
                    {...storeForm.register("addressLine1")}
                    rows={3}
                    placeholder="123 Main Street, City, Country"
                  />
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <FormLabel>Latitude</FormLabel>
                    <FormInput {...storeForm.register("latitude")} placeholder="40.7128" />
                  </div>
                  <div>
                    <FormLabel>Longitude</FormLabel>
                    <FormInput {...storeForm.register("longitude")} placeholder="-74.0060" />
                  </div>
                </div> */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => storeForm.reset()}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={!storeForm.formState.isDirty || updateStore.isPending}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
                  >
                    <FiSave className="size-3.5" />
                    {updateStore.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </SectionCard>

            {logoModal && (
              <UploadModal
                title="Logo"
                onClose={() => setLogoModal(false)}
                onUpload={async (file) => {
                  await uploadLogo.mutateAsync(file);
                  setLogoModal(false);
                  showToast("success", "Logo uploaded successfully");
                }}
                isPending={uploadLogo.isPending}
              />
            )}
            {faviconModal && (
              <UploadModal
                title="Favicon"
                onClose={() => setFaviconModal(false)}
                onUpload={async (file) => {
                  await uploadFavicon.mutateAsync(file);
                  setFaviconModal(false);
                  showToast("success", "Favicon uploaded successfully");
                }}
                isPending={uploadFavicon.isPending}
              />
            )}
          </div>
        )}

        {/* Tab 2: Business Info */}
        {activeTab === "business" && (
          <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
            <SectionCard
              title="Business Details"
              description="Your company registration and tax details."
              icon={FiBriefcase}
              iconBg="bg-indigo-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FormLabel>Company Name</FormLabel>
                  <FormInput
                    {...businessForm.register("companyName")}
                    placeholder="My Company Pvt. Ltd."
                  />
                  {businessForm.formState.errors.companyName && (
                    <p className="text-xs text-red-500 mt-1">
                      {businessForm.formState.errors.companyName.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel>GST Number</FormLabel>
                  <FormInput
                    {...businessForm.register("gstNumber")}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <FormLabel>PAN Number</FormLabel>
                  <FormInput {...businessForm.register("panNumber")} placeholder="ABCDE1234F" />
                </div>
                <div>
                  <FormLabel>CIN Number</FormLabel>
                  <FormInput
                    {...businessForm.register("cinNumber")}
                    placeholder="U12345DL2020PTC123456"
                  />
                </div>
              </div>
            </SectionCard>

            {/* <SectionCard
              title="Banking Information"
              description="Bank account details for payment settlements and payouts."
              icon={FiCreditCard}
              iconBg="bg-sky-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FormLabel>Bank Name</FormLabel>
                  <FormInput
                    {...businessForm.register("bankName")}
                    placeholder="State Bank of India"
                  />
                </div>
                <div>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormInput {...businessForm.register("ifscCode")} placeholder="SBIN0001234" />
                </div>
                <div className="md:col-span-2">
                  <FormLabel>Account Number</FormLabel>
                  <FormInput
                    {...businessForm.register("accountNumber")}
                    placeholder="123456789012"
                  />
                </div>
              </div>
            </SectionCard> */}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => businessForm.reset()}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!businessForm.formState.isDirty || updateBusiness.isPending}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
              >
                <FiSave className="size-3.5" />
                {updateBusiness.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Email Configuration */}
        {activeTab === "email" && (
          <SectionCard
            title="Email Settings"
            description="Sender configuration for notifications and transactional emails."
            icon={FiMail}
            iconBg="bg-indigo-500"
          >
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
              <div>
                <FormLabel>Sender Name</FormLabel>
                <FormInput {...emailForm.register("fromName")} placeholder="My Store" />
                {emailForm.formState.errors.fromName && (
                  <p className="text-xs text-red-500 mt-1">
                    {emailForm.formState.errors.fromName.message}
                  </p>
                )}
              </div>
              <div>
                <FormLabel>Sender Email</FormLabel>
                <FormInput
                  {...emailForm.register("fromEmail")}
                  type="email"
                  placeholder="noreply@mystore.com"
                />
                {emailForm.formState.errors.fromEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {emailForm.formState.errors.fromEmail.message}
                  </p>
                )}
              </div>
              <div>
                <FormLabel>Reply-To Email</FormLabel>
                <FormInput
                  {...emailForm.register("replyToEmail")}
                  type="email"
                  placeholder="support@mystore.com"
                />
                {emailForm.formState.errors.replyToEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {emailForm.formState.errors.replyToEmail.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => emailForm.reset()}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!emailForm.formState.isDirty || updateEmail.isPending}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
                >
                  <FiSave className="size-3.5" />
                  {updateEmail.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </SectionCard>
        )}

        {/* Tab 4: Social Links */}
        {activeTab === "social" && (
          <form onSubmit={socialForm.handleSubmit(onSocialSubmit)}>
            {!socialQuery.data && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 mb-6">
                <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <FiLink className="size-7 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Social Links Configured</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add your social media links below to get started.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PLATFORMS.map(({ key, label, placeholder, color }) => {
                const isOpen = openSocialSections[key] ?? true;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSocialSections((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <div className={`size-10 rounded-xl ${color} flex items-center justify-center`}>
                        <FiLink className="size-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{label}</span>
                      <span className="ml-auto text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5">
                        <FormLabel>{label} URL</FormLabel>
                        <FormInput {...socialForm.register(key)} placeholder={placeholder} />
                        {socialForm.formState.errors[key] && (
                          <p className="text-xs text-red-500 mt-1">
                            {socialForm.formState.errors[key]?.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => socialForm.reset()}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!socialForm.formState.isDirty || updateSocial.isPending}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
              >
                <FiSave className="size-3.5" />
                {updateSocial.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

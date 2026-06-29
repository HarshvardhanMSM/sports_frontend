"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiArrowLeft, FiClock, FiFileText, FiType } from "react-icons/fi";
import type { CmsPage } from "@/types/cms.types";
import Badge from "@/components/ui/badge/Badge";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-/]+$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  pageType: z.string().min(1, "Page Type is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CmsFormModalProps {
  page?: CmsPage | null;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
}

export default function CmsFormModal({ page, onClose, onSubmit, isPending }: CmsFormModalProps) {
  const isEdit = !!page;
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      content: page?.content ?? "",
      status: page?.status ?? "DRAFT",
      pageType: page?.pageType ?? "TERMS_AND_CONDITIONS",
    },
  });

  useEffect(() => {
    if (page) {
      reset({
        title: page.title ?? "",
        slug: page.slug ?? "",
        content: page.content ?? "",
        status: page.status ?? "DRAFT",
        pageType: page.pageType ?? "TERMS_AND_CONDITIONS",
      });
    }
  }, [page, reset]);

  const watchTitle = watch("title");
  const watchStatus = watch("status");
  const watchContent = watch("content") || "";

  // Handle distinct buttons setting the status value dynamically
  const submitWithStatus = (status: "PUBLISHED" | "DRAFT") => {
    setValue("status", status);
    handleSubmit(onSubmit)();
  };

  // Dynamically compute writing stats
  const charCount = watchContent.length;
  const wordCount = watchContent.trim() ? watchContent.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FiArrowLeft className="size-4" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {watchTitle || page?.title || (isEdit ? "Edit Page" : "Create New Page")}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit
                ? `Manage and publish the ${watchTitle || page?.title || "page"} details for your storefront.`
                : "Create and publish a new content page for your storefront."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Current {watchTitle || page?.title || "Page"}
                </h3>
                {isEdit && page.updatedAt && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <Badge color={watchStatus === "PUBLISHED" ? "success" : "warning"}>
                {watchStatus === "PUBLISHED" ? "Published" : "Draft"}
              </Badge>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g. Terms & Conditions"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-sans"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  {...register("slug")}
                  placeholder="e.g. terms-and-conditions"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Page Type
                </label>
                <select
                  {...register("pageType")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  <option value="ABOUT_US">About Us</option>
                  <option value="PRIVACY_POLICY">Privacy Policy</option>
                  <option value="TERMS_AND_CONDITIONS">Terms & Conditions</option>
                  <option value="SHIPPING_POLICY">Shipping Policy</option>
                  <option value="RETURN_POLICY">Return Policy</option>
                  <option value="CONTACT_US">Contact Us</option>
                  {/* <option value="CUSTOM_PAGE">Custom Page</option> */}
                </select>
                {errors.pageType && <p className="text-xs text-red-500 mt-1">{errors.pageType.message}</p>}
              </div>
            </div>

            {/* Content Textarea / Preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Content
                </label>
                {isPreviewMode && (
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                    Visual Preview Mode
                  </span>
                )}
              </div>
              
              {isPreviewMode ? (
                <div 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/10 p-6 min-h-[400px] overflow-y-auto select-text prose prose-sm max-w-none text-slate-800 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: watchContent || `<p class="text-slate-400 italic">No content written yet. Switch to Editor to write content.</p>` }}
                />
              ) : (
                <textarea
                  {...register("content")}
                  rows={16}
                  placeholder="Write page content (HTML formatting supported)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-sm leading-relaxed text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-y min-h-[400px]"
                />
              )}
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => submitWithStatus("DRAFT")}
                disabled={isPending}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => submitWithStatus("PUBLISHED")}
                disabled={isPending}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isPending ? "Publishing..." : isEdit ? "Publish Update" : "Publish Page"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel (Page Quick Stats) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiClock className="size-4 text-slate-400" />
              Page Quick Stats
            </h3>

            {/* Editor Mode Toggle */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Editor Mode</p>
              <div className="flex rounded-lg bg-slate-200/60 p-1">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(false)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    !isPreviewMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(true)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isPreviewMode ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Visual Preview
                </button>
              </div>
            </div>

            {/* Stats Metrics */}
            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <FiFileText className="size-4 text-indigo-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Word Count</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{wordCount}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <FiType className="size-4 text-emerald-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Characters</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{charCount}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <FiClock className="size-4 text-amber-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Read Time</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

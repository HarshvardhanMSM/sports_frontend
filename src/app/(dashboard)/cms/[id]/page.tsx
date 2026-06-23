"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft, FiEdit, FiClock, FiFileText, FiType } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useCmsPage } from "@/hooks/useCmsPages";
import CmsStatusBadge from "@/features/cms/components/CmsStatusBadge";

interface ViewCmsPageProps {
  params: Promise<{ id: string }>;
}

const formatPageType = (type: string) => {
  const mapping: Record<string, string> = {
    ABOUT_US: "About Us",
    PRIVACY_POLICY: "Privacy Policy",
    TERMS_AND_CONDITIONS: "Terms & Conditions",
    SHIPPING_POLICY: "Shipping Policy",
    RETURN_POLICY: "Return Policy",
    CONTACT_US: "Contact Us",
    CUSTOM_PAGE: "Custom Page",
  };
  return mapping[type] || type;
};

export default function ViewCmsPage({ params }: ViewCmsPageProps) {
  const { id } = React.use(params);
  const { data: pageRes, isLoading, error } = useCmsPage(id);

  const page = pageRes?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading page details...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The page you are looking for does not exist or has been deleted.
        </p>
        <Link
          href="/cms"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Pages
        </Link>
      </div>
    );
  }

  const content = page.content || "";
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/cms"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiArrowLeft className="size-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{page.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">/{page.slug}</p>
          </div>
        </div>
        <Can permission="cms.manage">
          <Link
            href={`/cms/edit/${page.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FiEdit className="size-4" />
            Edit Page
          </Link>
        </Can>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Readonly Content & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Current {page.title}
                </h3>
                {page.updatedAt && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Last updated {new Date(page.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <CmsStatusBadge status={page.status} />
            </div>

            {/* Readonly Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-slate-100 bg-slate-50/50 p-4 rounded-xl text-xs">
              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-400 mb-1">Page Type</p>
                <p className="font-semibold text-slate-700">{formatPageType(page.pageType || "") || "-"}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-400 mb-1">Slug</p>
                <p className="font-semibold text-slate-700 font-mono">/{page.slug}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-400 mb-1">Created At</p>
                <p className="font-semibold text-slate-700">
                  {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>

            {/* Read-only Content View */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Content Preview</p>
              <div 
                className="w-full rounded-xl border border-slate-200 bg-slate-50/20 p-6 font-mono text-sm leading-relaxed text-slate-800 overflow-y-auto min-h-[400px] whitespace-pre-wrap select-text prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Page Quick Stats */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FiClock className="size-4 text-slate-400" />
              Page Quick Stats
            </h3>

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

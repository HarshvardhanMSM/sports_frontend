"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit, FiSliders, FiCalendar } from "react-icons/fi";
import { useAttribute } from "@/hooks/useAttributes";
import Badge from "@/components/ui/badge/Badge";

interface ViewAttributePageProps {
  params: Promise<{ id: string }>;
}

export default function ViewAttributePage({ params }: ViewAttributePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useAttribute(id);

  const attr = data?.data;

  if (!id || id === "undefined") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Invalid ID</h2>
        <p className="text-sm text-slate-500 mt-2">The attribute ID provided is invalid.</p>
        <button onClick={() => router.push("/attributes")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading attribute...</p>
      </div>
    );
  }

  if (isError || !attr) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Attribute Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The attribute does not exist or has been deleted.</p>
        <button onClick={() => router.push("/attributes")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Attributes</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/attributes")} className="flex items-center justify-center size-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors">
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{attr.name}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Slug: {attr.slug}</p>
          </div>
        </div>
        <Link href={`/attributes/${attr.id}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiEdit className="size-4" /> Edit Attribute
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attribute Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Name</span>
                <span className="text-sm font-semibold text-slate-800">{attr.name}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Slug</span>
                <span className="text-sm font-mono text-slate-800">{attr.slug}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Filterable</span>
                <Badge color={attr.isFilterable ? "success" : "dark"}>{attr.isFilterable ? "Yes" : "No"}</Badge>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Required</span>
                <Badge color={attr.isRequired ? "primary" : "dark"}>{attr.isRequired ? "Yes" : "No"}</Badge>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Sort Order</span>
                <span className="text-sm font-bold text-slate-800">{attr.sortOrder}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attribute Values</h3>
            {attr.values && attr.values.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {attr.values.map((val) => (
                  <span
                    key={val.id}
                    className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
                  >
                    {val.value}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No values defined for this attribute.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FiSliders className="size-4.5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Entity</span>
                <span className="text-sm font-bold text-slate-800">Attribute</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-800">{new Date(attr.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-800">{new Date(attr.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiX, FiEye, FiCode, FiCopy } from "react-icons/fi";
import type { EmailTemplate } from "@/types/email-template.types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const VARIABLES = [
  "{{firstName}}",
  "{{lastName}}",
  "{{email}}",
  "{{orderNumber}}",
  "{{trackingNumber}}",
  "{{amount}}",
  "{{verificationCode}}",
  "{{resetLink}}",
];

interface EmailTemplateFormModalProps {
  template?: EmailTemplate | null;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
  isPending: boolean;
}

export default function EmailTemplateFormModal({
  template,
  onSubmit,
  onClose,
  isPending,
}: EmailTemplateFormModalProps) {
  const isEdit = !!template;
  const [tab, setTab] = useState<"editor" | "preview">("editor");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name ?? "",
      code: template?.code ?? "",
      subject: template?.subject ?? "",
      description: template?.description ?? "",
      body: template?.body ?? "",
      isActive: template?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        code: template.code,
        subject: template.subject,
        description: template.description ?? "",
        body: template.body,
        isActive: template.isActive,
      });
    }
  }, [template, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const bodyValue = watch("body");

  const insertVariable = (variable: string) => {
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
      const name = activeEl.getAttribute("name") as keyof FormValues | null;
      if (name && ["name", "code", "subject", "description", "body"].includes(name)) {
        const start = activeEl.selectionStart ?? 0;
        const end = activeEl.selectionEnd ?? 0;
        const current = (watch(name) as string | undefined) || "";
        const newVal = current.substring(0, start) + variable + current.substring(end);
        setValue(name, newVal, { shouldDirty: true });
        setTimeout(() => {
          activeEl.focus();
          activeEl.selectionStart = activeEl.selectionEnd = start + variable.length;
        }, 0);
        return;
      }
    }

    // Fallback: If no relevant input is active, insert into the main body textarea
    const textarea = document.querySelector<HTMLTextAreaElement>("#body-field");
    if (textarea) {
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const current = watch("body") || "";
      const newVal = current.substring(0, start) + variable + current.substring(end);
      setValue("body", newVal, { shouldDirty: true });
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      }, 0);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-4 flex w-full max-w-4xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? "Edit Email Template" : "Create Email Template"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? "Update template content and settings" : "Design a new transactional email template"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="email-template-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Variable Helper */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Variables
              </label>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                Click a variable below to insert it at your cursor in any active text field
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {VARIABLES.map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertVariable(variable);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <FiCopy className="size-3" />
                  {variable}
                </button>
              ))}
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Welcome Email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Code
              </label>
              <input
                {...register("code")}
                placeholder="e.g. welcome_email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Subject
              </label>
              <input
                {...register("subject")}
                placeholder="e.g. Welcome to {{storeName}}!"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Active
              </label>
              <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Template is active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Description
            </label>
            <input
              {...register("description")}
              placeholder="Brief description of when this template is used..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Body with tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100/70 p-1">
                <button
                  type="button"
                  onClick={() => setTab("editor")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    tab === "editor"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FiCode className="size-3.5" />
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    tab === "preview"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <FiEye className="size-3.5" />
                  Preview
                </button>
              </div>
            </div>

            {tab === "editor" ? (
              <div>
                <textarea
                  id="body-field"
                  {...register("body")}
                  rows={12}
                  placeholder="<html>...</html>"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 font-mono resize-y"
                />
                {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white min-h-[300px] p-4 overflow-auto">
                {bodyValue ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyValue }} />
                ) : (
                  <p className="text-sm text-slate-400 italic">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>


        </form>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="email-template-form"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            {isPending ? "Saving..." : isEdit ? "Update Template" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { FiPlus, FiMail, FiCheckCircle, FiXCircle, FiAlertCircle, FiShield } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useEmailTemplates, useCreateEmailTemplate, useUpdateEmailTemplate, useDeleteEmailTemplate } from "@/hooks/useEmailTemplates";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { EmailTemplateListParams } from "@/types/email-template.types";
import type { EmailTemplate } from "@/types/email-template.types";
import EmailTemplateTable from "@/features/email-templates/components/EmailTemplateTable";
import EmailTemplateFormModal from "@/features/email-templates/components/EmailTemplateFormModal";
import DeleteEmailTemplateModal from "@/features/email-templates/components/DeleteEmailTemplateModal";

export default function EmailTemplatesPage() {
  const { query: searchTerm, setQuery: setSearchTerm, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [formTarget, setFormTarget] = useState<EmailTemplate | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailTemplate | null>(null);

  const params: EmailTemplateListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    ...(statusFilter === "active" ? { isActive: true, status: "active" } : {}),
    ...(statusFilter === "inactive" ? { isActive: false, status: "inactive" } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useEmailTemplates(params);
  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateEmailTemplate();
  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateEmailTemplate(formTarget && formTarget !== "new" ? formTarget.id : "");
  const { mutateAsync: deleteTemplate, isPending: isDeleting } = useDeleteEmailTemplate();

  const items = data?.data?.templates ?? [];
  const total = data?.data?.totalTemplates ?? items.length;
  const totalPages = 1;
  const limit = total || 10;
  const activeCount = data?.data?.activeTemplates ?? 0;
  const inactiveCount = data?.data?.inactiveTemplates ?? 0;
  const systemCount = items.filter((t) => t.isSystem).length || 0;

  const isFormPending = isCreating || isUpdating;

  const handleEdit = (id: string) => {
    const tpl = items.find((t) => t.id === id);
    if (tpl) setFormTarget(tpl);
  };

  const handleDelete = (id: string) => {
    const tpl = items.find((t) => t.id === id);
    if (tpl) setDeleteTarget(tpl);
  };

  const handleFormSubmit = async (values: { name: string; code: string; subject: string; description?: string; body: string; isActive: boolean }) => {
    if (formTarget === "new") {
      await createTemplate(values as Record<string, unknown>);
    } else if (formTarget) {
      await updateTemplate(values as Record<string, unknown>);
    }
    setFormTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteTemplate(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isFiltered = searchTerm !== "" || statusFilter !== "All";

  return (
    <ListPageLayout
      badge="Email Templates"
      title="Email Templates"
      description="Manage transactional email templates for customer communications."
      headerAction={
        <Can permission="email_template.create">
          <button
            type="button"
            onClick={() => setFormTarget("new")}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            Add Template
          </button>
        </Can>
      }
      stats={[
        { label: "Total Templates", value: total, icon: FiMail, color: "indigo", sub: "All email templates" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, color: "emerald", sub: "Currently active" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, color: "rose", sub: "Inactive templates" },
        { label: "System", value: systemCount, icon: FiShield, color: "amber", sub: "System templates" },
      ]}
      statsColumns={4}
      search={searchTerm}
      onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
      searchPlaceholder="Search templates by name or code..."
      selectFilters={[
        {
          label: "Status",
          value: statusFilter,
          onChange: (v) => { setStatusFilter(v); setPage(1); },
          options: [
            { value: "All", label: "All Templates" },
            { value: "active", label: "Active Only" },
            { value: "inactive", label: "Inactive Only" },
          ],
        },
      ]}
      onRefresh={() => refetch()}
      isRefreshing={isRefetching}
      isPending={isLoading}
      isError={!!error}
      error={error as Error}
      refetch={refetch}
      hasData={items.length > 0}
      tableComponent={<EmailTemplateTable templates={items} onEdit={handleEdit} onDelete={handleDelete} />}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiMail className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching templates" : "No templates found"}
      emptyDescription={isFiltered ? "No templates match your current filters. Try refining your search query." : "Start by creating your first transactional email template."}
      emptyAction={!isFiltered ? (
        <Can permission="email_template.create">
          <button
            type="button"
            onClick={() => setFormTarget("new")}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            Add Template
          </button>
        </Can>
      ) : undefined}
    >
      {/* Form Modal */}
      {formTarget && (
        <EmailTemplateFormModal
          template={formTarget === "new" ? null : formTarget}
          onSubmit={handleFormSubmit}
          onClose={() => setFormTarget(null)}
          isPending={isFormPending}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteEmailTemplateModal
          templateName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </ListPageLayout>
  );
}

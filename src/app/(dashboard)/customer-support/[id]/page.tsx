"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiCheckCircle,
  FiRotateCcw,
  FiPaperclip,
  FiTag,
  FiClock,
  FiUser,
  FiSend,
  FiPlus,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import {
  useSupportTicket,
  useSupportTicketAttachments,
  useSupportTicketTags,
  useSupportTicketAudit,
  useAssignSupportTicket,
  useReplySupportTicket,
  useResolveSupportTicket,
  useReopenSupportTicket,
  useAddSupportNote,
  useAddSupportTag,
  useRemoveSupportTag,
} from "@/hooks/useSupportTickets";
import { useAdminRoles } from "@/hooks/useRoles";
import type { AuditLogEntry } from "@/types/support-ticket.types";
import { SUPER_ADMIN_ROLE } from "@/types/role.types";
import type { Role } from "@/types/role.types";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-orange-50 text-orange-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-600",
  ESCALATED: "bg-red-50 text-red-700",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

export default function CustomerSupportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { data: ticketRes, isLoading, error, refetch } = useSupportTicket(id);
  const { data: attachRes } = useSupportTicketAttachments(id);
  const { data: tagsRes } = useSupportTicketTags(id);
  const { data: auditRes } = useSupportTicketAudit(id);

  const { data: roles } = useAdminRoles();
  const adminRoles = (roles ?? []).filter(
    (r: Role) => r.name !== SUPER_ADMIN_ROLE,
  );

  const assignMutation = useAssignSupportTicket();
  const replyMutation = useReplySupportTicket();
  const resolveMutation = useResolveSupportTicket();
  const reopenMutation = useReopenSupportTicket();
  const noteMutation = useAddSupportNote();
  const addTagMutation = useAddSupportTag();
  const removeTagMutation = useRemoveSupportTag();

  const ticket = ticketRes?.data;
  const attachments = attachRes?.data ?? [];
  const tags = tagsRes?.data ?? [];
  const auditLog = (auditRes?.data ?? []) as AuditLogEntry[];

  // UI state
  const [showAssign, setShowAssign] = useState(false);
  const [assignAdminId, setAssignAdminId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [resolutionText, setResolutionText] = useState("");
  const [showResolve, setShowResolve] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [showReopen, setShowReopen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [newTag, setNewTag] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <FiAlertCircle className="size-10 text-rose-500 mb-4" />
        <p className="text-sm font-semibold text-slate-800">
          Failed to load ticket
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleAssign = async () => {
    if (!assignAdminId) return;
    await assignMutation.mutateAsync({
      id: ticket.id,
      body: { assignedTo: assignAdminId },
    });
    setShowAssign(false);
    setAssignAdminId("");
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await replyMutation.mutateAsync({
      id: ticket.id,
      body: { message: replyText },
    });
    setReplyText("");
  };

  const handleResolve = async () => {
    await resolveMutation.mutateAsync({
      id: ticket.id,
      body: resolutionText.trim() ? { resolution: resolutionText } : undefined,
    });
    setShowResolve(false);
    setResolutionText("");
  };

  const handleReopen = async () => {
    if (!reopenReason.trim()) return;
    await reopenMutation.mutateAsync({
      id: ticket.id,
      body: { reason: reopenReason },
    });
    setShowReopen(false);
    setReopenReason("");
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await noteMutation.mutateAsync({ id: ticket.id, body: { note: noteText } });
    setShowNote(false);
    setNoteText("");
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    await addTagMutation.mutateAsync({ id: ticket.id, tag: newTag.trim() });
    setNewTag("");
  };

  const handleRemoveTag = async (tagId: string) => {
    await removeTagMutation.mutateAsync({ id: ticket.id, tagId });
  };

  // ── Render ────────────────────────────────────────────────────

  const actionBtn =
    "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5";

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.push("/customer-support")}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
        >
          <FiArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">
              {ticket.subject}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.status]}`}
            >
              {ticket.status === "IN_PROGRESS"
                ? "In Progress"
                : ticket.status.charAt(0) +
                  ticket.status.slice(1).toLowerCase()}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[ticket.priority]}`}
            >
              {ticket.priority}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {ticket.ticketNumber} &middot; {ticket.category}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Action buttons */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-2">
            {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
              <>
                <button
                  onClick={() => setShowAssign(true)}
                  className={actionBtn}
                >
                  <FiUser className="size-3.5" /> Assign
                </button>
                <button
                  onClick={() => setShowResolve(true)}
                  className={actionBtn}
                >
                  <FiCheckCircle className="size-3.5" /> Resolve
                </button>
              </>
            )}
            {(ticket.status === "RESOLVED" || ticket.status === "CLOSED") && (
              <button onClick={() => setShowReopen(true)} className={actionBtn}>
                <FiRotateCcw className="size-3.5" /> Reopen
              </button>
            )}
            <button onClick={() => setShowNote(true)} className={actionBtn}>
              <FiMessageCircle className="size-3.5" /> Add Note
            </button>
          </div>

          {/* Reply section */}
          {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Reply</h3>
              <textarea
                rows={4}
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-y"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <FiSend className="size-3.5" />
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <FiPaperclip className="size-4" /> Attachments
              </h3>
              <div className="space-y-2">
                {attachments.map((a) => (
                  <a
                    key={a.id}
                    href={a.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-sm text-indigo-600"
                  >
                    <FiPaperclip className="size-3.5 shrink-0" />
                    <span className="font-medium">{a.fileName}</span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {(a.size / 1024).toFixed(1)} KB
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <FiTag className="size-4" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  {t.name}
                  <button
                    onClick={() => handleRemoveTag(t.id)}
                    className="hover:text-rose-600"
                  >
                    <FiX className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || addTagMutation.isPending}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
              >
                <FiPlus className="size-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Audit Log */}
          {auditLog.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <FiClock className="size-4" /> Audit Log
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {auditLog.map((entry: AuditLogEntry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="size-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700">
                        <span className="font-semibold">
                          {entry.performedByName}
                        </span>{" "}
                        {entry.action}
                      </p>
                      {entry.details && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {entry.details}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Ticket Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400">Customer</p>
                <p className="text-slate-800 font-medium">
                  {ticket.customerName}
                </p>
                <p className="text-slate-500 text-xs">{ticket.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Assigned Admin
                </p>
                <p className="text-slate-800">
                  {ticket.assignedAdminName ?? "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Created</p>
                <p className="text-slate-800">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              {ticket.updatedAt && (
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Last Updated
                  </p>
                  <p className="text-slate-800">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}

      {/* Assign Modal */}
      {showAssign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowAssign(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Assign Ticket
            </h3>
            <select
              value={assignAdminId}
              onChange={(e) => setAssignAdminId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 mb-4"
            >
              <option value="">Select an admin...</option>
              {adminRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssign(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignAdminId || assignMutation.isPending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {assignMutation.isPending ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolve && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowResolve(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Resolve Ticket
            </h3>
            <textarea
              rows={3}
              placeholder="Resolution notes (optional)"
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-y mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResolve(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={resolveMutation.isPending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {resolveMutation.isPending ? "Resolving..." : "Resolve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {showReopen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowReopen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Reopen Ticket
            </h3>
            <textarea
              rows={3}
              placeholder="Reason for reopening..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-y mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReopen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReopen}
                disabled={!reopenReason.trim() || reopenMutation.isPending}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {reopenMutation.isPending ? "Reopening..." : "Reopen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowNote(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-700 mb-4">Add Note</h3>
            <textarea
              rows={4}
              placeholder="Type your note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-y mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNote(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || noteMutation.isPending}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {noteMutation.isPending ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

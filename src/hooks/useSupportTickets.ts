"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportTicketService } from "@/services/support-ticket.service";
import { UserService } from "@/services/user.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type {
  SupportTicketListParams,
  AssignTicketRequest,
  ReplyTicketRequest,
  AddNoteRequest,
} from "@/types/support-ticket.types";

export const supportTicketKeys = {
  all:          ()                          => ["support"]                     as const,
  lists:        ()                          => ["support", "list"]             as const,
  list:         (p?: SupportTicketListParams) => ["support", "list", p]        as const,
  details:      ()                          => ["support", "detail"]           as const,
  detail:       (id: string)                => ["support", "detail", id]       as const,
  attachments:  (id: string)                => ["support", "attachments", id]  as const,
  tags:         (id: string)                => ["support", "tags", id]         as const,
  audit:        (id: string)                => ["support", "audit", id]        as const,
};

// ── Queries ──────────────────────────────────────────────────────

export function useSupportTickets(params?: SupportTicketListParams) {
  return useQuery({
    queryKey: supportTicketKeys.list(params),
    queryFn: () => SupportTicketService.getAll(params),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useSupportTicket(id: string | undefined) {
  return useQuery({
    queryKey: supportTicketKeys.detail(id ?? ""),
    queryFn: () => SupportTicketService.getById(id!),
    enabled: !!id,
  });
}

export function useSupportTicketAttachments(id: string | undefined) {
  return useQuery({
    queryKey: supportTicketKeys.attachments(id ?? ""),
    queryFn: () => SupportTicketService.getAttachments(id!),
    enabled: !!id,
  });
}

export function useSupportTicketTags(id: string | undefined) {
  return useQuery({
    queryKey: supportTicketKeys.tags(id ?? ""),
    queryFn: () => SupportTicketService.getTags(id!),
    enabled: !!id,
  });
}

export function useSupportTicketAudit(id: string | undefined) {
  return useQuery({
    queryKey: supportTicketKeys.audit(id ?? ""),
    queryFn: () => SupportTicketService.getAuditLog(id!),
    enabled: !!id,
  });
}

// ── Mutations ────────────────────────────────────────────────────

export function useAssignSupportTicket() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignTicketRequest }) =>
      SupportTicketService.assign(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Ticket assigned successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useReplySupportTicket() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ReplyTicketRequest }) =>
      SupportTicketService.reply(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Reply sent successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useResolveSupportTicket() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: { resolution?: string } }) =>
      SupportTicketService.resolve(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Ticket resolved.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useReopenSupportTicket() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { reason: string } }) =>
      SupportTicketService.reopen(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Ticket reopened.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useAddSupportNote() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddNoteRequest }) =>
      SupportTicketService.addNote(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Note added.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useAddSupportTag() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, tag }: { id: string; tag: string }) =>
      SupportTicketService.addTag(id, tag),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Tag added.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useRemoveSupportTag() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, tagId }: { id: string; tagId: string }) =>
      SupportTicketService.removeTag(id, tagId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Tag removed.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUploadSupportAttachments() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      SupportTicketService.uploadAttachments(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
      toast.success("Attachment uploaded.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => UserService.getUsers(),
  });
}

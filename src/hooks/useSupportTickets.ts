"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportTicketService } from "@/services/support-ticket.service";
import { UserService } from "@/services/user.service";
import type {
  SupportTicketListParams,
  AssignTicketRequest,
  ReplyTicketRequest,
  AddNoteRequest,
  AddTagRequest,
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
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignTicketRequest }) =>
      SupportTicketService.assign(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useReplySupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ReplyTicketRequest }) =>
      SupportTicketService.reply(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useResolveSupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: { resolution?: string } }) =>
      SupportTicketService.resolve(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useReopenSupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { reason: string } }) =>
      SupportTicketService.reopen(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useAddSupportNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddNoteRequest }) =>
      SupportTicketService.addNote(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useAddSupportTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tag }: { id: string; tag: string }) =>
      SupportTicketService.addTag(id, tag),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useRemoveSupportTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tagId }: { id: string; tagId: string }) =>
      SupportTicketService.removeTag(id, tagId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useUploadSupportAttachments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      SupportTicketService.uploadAttachments(id, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supportTicketKeys.all() });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => UserService.getUsers(),
  });
}

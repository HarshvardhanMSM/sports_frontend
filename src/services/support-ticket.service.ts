import { api } from "./api";
import type {
  SupportTicketListResponse,
  SupportTicketDetailResponse,
  SupportTicketActionResponse,
  SupportAttachmentListResponse,
  SupportTagListResponse,
  AuditLogListResponse,
  SupportTicketListParams,
  AssignTicketRequest,
  ReplyTicketRequest,
  AddNoteRequest,
  AddTagRequest,
} from "@/types/support-ticket.types";

export const SupportTicketService = {
  // ── Queries ────────────────────────────────────────────────────

  getAll(params?: SupportTicketListParams) {
    return api.get<SupportTicketListResponse>("/admin/support", params);
  },

  getById(id: string) {
    return api.get<SupportTicketDetailResponse>(`/admin/support/${id}`);
  },

  getAttachments(id: string) {
    return api.get<SupportAttachmentListResponse>(`/admin/support/${id}/attachments`);
  },

  getTags(id: string) {
    return api.get<SupportTagListResponse>(`/admin/support/${id}/tags`);
  },

  getAuditLog(id: string) {
    return api.get<AuditLogListResponse>(`/admin/support/${id}/audit`);
  },

  // ── Mutations ──────────────────────────────────────────────────

  assign(id: string, body: AssignTicketRequest) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/assign`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  reply(id: string, body: ReplyTicketRequest) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/reply`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  resolve(id: string, body?: { resolution?: string }) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/resolve`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  reopen(id: string, body: { reason: string }) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/reopen`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  addNote(id: string, body: AddNoteRequest) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/note`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  uploadAttachments(id: string, formData: FormData) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  addTag(id: string, tag: string) {
    return api.post<SupportTicketActionResponse>(`/admin/support/${id}/tags`, { tag }, {
      headers: { "Content-Type": "application/json" },
    });
  },

  removeTag(id: string, tagId: string) {
    return api.delete<SupportTicketActionResponse>(`/admin/support/${id}/tags/${tagId}`);
  },
};

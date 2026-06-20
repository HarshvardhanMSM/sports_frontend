export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "ESCALATED";
export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  customerId: string;
  customerName: string;
  customerEmail: string;
  assignedAdminId?: string;
  assignedAdminName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportTicketDetail extends SupportTicket {
  description?: string;
  attachments?: SupportAttachment[];
  tags?: SupportTag[];
  auditLog?: AuditLogEntry[];
}

export interface SupportAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface SupportTag {
  id: string;
  name: string;
  tag:string
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedByName: string;
  createdAt: string;
  details?: string;
}

export interface SupportTicketListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: SupportTicketStatus | string;
  priority?: SupportTicketPriority | string;
  assignedAdminId?: string;
  customerSearch?: string;
  startDate?: string;
  endDate?: string;
}

export interface AssignTicketRequest {
  assignedTo: string;
}

export interface ReplyTicketRequest {
  message: string;
}

export interface ResolveTicketRequest {
  resolution?: string;
}

export interface ReopenTicketRequest {
  reason: string;
}

export interface AddNoteRequest {
  note: string;
}

export type AddTagRequest = string;

// ── Response types ────────────────────────────────────────────────

export interface SupportTicketListResponse {
  statusCode: number;
  message: string;
  data: {
    items: SupportTicket[];
    total: number;
  };
}

export interface SupportTicketDetailResponse {
  statusCode: number;
  message: string;
  data: SupportTicketDetail;
}

export interface SupportTicketActionResponse {
  statusCode: number;
  message: string;
}

export interface SupportAttachmentListResponse {
  statusCode: number;
  message: string;
  data: SupportAttachment[];
}

export interface SupportTagListResponse {
  statusCode: number;
  message: string;
  data: SupportTag[];
}

export interface AuditLogListResponse {
  statusCode: number;
  message: string;
  data: AuditLogEntry[];
}

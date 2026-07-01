import { api } from "./api";
import type { EmailTemplateListResponse, EmailTemplateSingleResponse, EmailTemplateDeleteResponse, EmailTemplateListParams } from "@/types/email-template.types";

export const emailTemplateKeys = {
  all:         ()                               => ["email-templates"]             as const,
  lists:       ()                               => ["email-templates", "list"]     as const,
  list:        (p: EmailTemplateListParams)      => ["email-templates", "list", p]  as const,
  details:     ()                               => ["email-templates", "detail"]   as const,
  detail:      (id: string)                     => ["email-templates", "detail", id] as const,
};

export const EmailTemplateService = {
  getTemplates(params?: EmailTemplateListParams) {
    return api.get<EmailTemplateListResponse>("/admin/email-templates", params);
  },

  getTemplate(id: string) {
    return api.get<EmailTemplateSingleResponse>(`/admin/email-templates/${id}`);
  },

  createTemplate(body: Record<string, unknown>) {
    return api.post<EmailTemplateSingleResponse>("/admin/email-templates", body);
  },

  updateTemplate(id: string, body: Record<string, unknown>) {
    return api.patch<EmailTemplateSingleResponse>(`/admin/email-templates/${id}`, body);
  },

  deleteTemplate(id: string) {
    return api.delete<EmailTemplateDeleteResponse>(`/admin/email-templates/${id}`);
  },
};

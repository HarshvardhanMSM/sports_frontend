import { api } from "./api";
import type { EmailSettings, UpdateEmailSettingsDto, EmailSettingsResponse, SmtpSettings, UpdateSmtpSettingsDto, SmtpTestPayload, SmtpTestResponse } from "@/types/email-settings.types";

export const emailSettingsKeys = {
  all:   () => ["email-settings"]         as const,
  fetch: () => ["email-settings", "data"] as const,
};

export const smtpSettingsKeys = {
  all:   () => ["smtp-settings"]         as const,
  fetch: () => ["smtp-settings", "data"] as const,
};

export const EmailSettingsService = {
  async get(): Promise<EmailSettings> {
    const res = await api.get<EmailSettingsResponse>("/admin/settings/email");
    return res.data;
  },

  async update(data: UpdateEmailSettingsDto): Promise<EmailSettings> {
    const res = await api.patch<EmailSettingsResponse>("/admin/settings/email", data);
    return res.data;
  },
};

export const SmtpSettingsService = {
  async get(): Promise<SmtpSettings> {
    const res = await api.get<{ statusCode: number; message: string; data: SmtpSettings }>("/admin/settings/email-smtp");
    return res.data;
  },

  async update(data: UpdateSmtpSettingsDto): Promise<SmtpSettings> {
    const res = await api.patch<{ statusCode: number; message: string; data: SmtpSettings }>("/admin/settings/email-smtp", data);
    return res.data;
  },

  async test(payload: SmtpTestPayload): Promise<SmtpTestResponse> {
    return api.post<SmtpTestResponse>("/admin/settings/email-smtp/test", payload);
  },
};

import { api } from "./api";
import type { EmailSettings, UpdateEmailSettingsDto, EmailSettingsResponse } from "@/types/email-settings.types";

export const emailSettingsKeys = {
  all:   () => ["email-settings"]         as const,
  fetch: () => ["email-settings", "data"] as const,
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

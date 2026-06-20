import { api } from "./api";
import type { BusinessSettings, UpdateBusinessSettingsDto, BusinessSettingsResponse } from "@/types/business-settings.types";

export const businessSettingsKeys = {
  all:   () => ["business-settings"]         as const,
  fetch: () => ["business-settings", "data"] as const,
};

export const BusinessSettingsService = {
  async get(): Promise<BusinessSettings> {
    const res = await api.get<BusinessSettingsResponse>("/admin/settings/business");
    return res.data;
  },

  async update(data: UpdateBusinessSettingsDto): Promise<BusinessSettings> {
    const res = await api.patch<BusinessSettingsResponse>("/admin/settings/business", data);
    return res.data;
  },
};

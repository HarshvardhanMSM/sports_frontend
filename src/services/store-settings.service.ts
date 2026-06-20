import { api } from "./api";
import type { StoreSettings, UpdateStoreSettingsDto, StoreSettingsResponse } from "@/types/store-settings.types";

export const storeSettingsKeys = {
  all:   () => ["store-settings"]         as const,
  fetch: () => ["store-settings", "data"] as const,
};

export const StoreSettingsService = {
  async get(): Promise<StoreSettings> {
    const res = await api.get<StoreSettingsResponse>("/admin/settings/store");
    return res.data;
  },

  async update(data: UpdateStoreSettingsDto): Promise<StoreSettings> {
    const res = await api.patch<StoreSettingsResponse>("/admin/settings/store", data);
    return res.data;
  },

  async uploadLogo(file: File): Promise<{ logo: string }> {
    const fd = new FormData();
    fd.append("logo", file);
    const res = await api.post<StoreSettingsResponse>("/admin/settings/store/logo", fd);
    return { logo: res.data.logoUrl ?? "" };
  },

  async uploadFavicon(file: File): Promise<{ favicon: string }> {
    const fd = new FormData();
    fd.append("favicon", file);
    const res = await api.post<StoreSettingsResponse>("/admin/settings/store/favicon", fd);
    return { favicon: res.data.faviconUrl ?? "" };
  },
};

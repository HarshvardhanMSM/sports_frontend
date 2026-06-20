import { api } from "./api";
import type { SocialLinks, UpdateSocialLinksDto, SocialLinksResponse } from "@/types/social-links.types";

export const socialLinksKeys = {
  all:   () => ["social-links"]         as const,
  fetch: () => ["social-links", "data"] as const,
};

export const SocialLinksService = {
  async get(): Promise<SocialLinks> {
    const res = await api.get<SocialLinksResponse>("/admin/settings/social-links");
    return res.data;
  },

  async update(data: UpdateSocialLinksDto): Promise<SocialLinks> {
    const res = await api.patch<SocialLinksResponse>("/admin/settings/social-links", data);
    return res.data;
  },
};

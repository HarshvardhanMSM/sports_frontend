import { api } from "./api";
import type {
  CmsPageListResponse,
  CmsPageSingleResponse,
  CmsPageDeleteResponse,
  CmsPageListParams,
  CreateCmsPageRequest,
  UpdateCmsPageRequest,
} from "@/types/cms.types";

export const cmsKeys = {
  all:         ()                        => ["cms-pages"]                  as const,
  lists:       ()                        => ["cms-pages", "list"]          as const,
  list:        (p: CmsPageListParams)    => ["cms-pages", "list", p]       as const,
  details:     ()                        => ["cms-pages", "detail"]        as const,
  detail:      (id: string)              => ["cms-pages", "detail", id]    as const,
};

export const CmsService = {
  getPages(params?: CmsPageListParams) {
    return api.get<CmsPageListResponse>("/admin/cms-pages", params);
  },

  getPage(id: string) {
    return api.get<CmsPageSingleResponse>(`/admin/cms-pages/${id}`);
  },

  createPage(data: CreateCmsPageRequest) {
    return api.post<CmsPageSingleResponse>("/admin/cms-pages", data);
  },

  updatePage(id: string, data: UpdateCmsPageRequest) {
    return api.patch<CmsPageSingleResponse>(`/admin/cms-pages/${id}`, data);
  },

  deletePage(id: string) {
    return api.delete<CmsPageDeleteResponse>(`/admin/cms-pages/${id}`);
  },
};

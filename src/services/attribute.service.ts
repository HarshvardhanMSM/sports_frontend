import { api } from "./api";
import type {
  AttributeListResponse,
  AttributeSingleResponse,
  CreateAttributeRequest,
  UpdateAttributeRequest,
  AttributeListParams,
} from "@/types/attribute.types";

export const attributeKeys = {
  all:     ()                       => ["attributes"]            as const,
  lists:   ()                       => ["attributes", "list"]    as const,
  list:    (p: AttributeListParams) => ["attributes", "list", p] as const,
  details: ()                       => ["attributes", "detail"]  as const,
  detail:  (id: string)             => ["attributes", "detail", id] as const,
};

export const AttributeService = {
  getAttributes(params?: AttributeListParams) {
    return api.get<AttributeListResponse>("/admin/attributes", params);
  },

  getAttribute(id: string) {
    return api.get<AttributeSingleResponse>(`/admin/attributes/${id}`);
  },

  createAttribute(data: CreateAttributeRequest) {
    return api.post<AttributeSingleResponse>("/admin/attributes", data);
  },

  updateAttribute(id: string, data: UpdateAttributeRequest) {
    return api.patch<AttributeSingleResponse>(`/admin/attributes/${id}`, data);
  },

  deleteAttribute(id: string) {
    return api.delete<void>(`/admin/attributes/${id}`);
  },
};

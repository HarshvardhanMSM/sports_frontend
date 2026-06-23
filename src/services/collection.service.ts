import { api } from "./api";
import type {
  CollectionListResponse,
  CollectionSingleResponse,
  CollectionDeleteResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CollectionListParams,
} from "@/types/collection.types";

export const collectionKeys = {
  all:     ()                          => ["collections"]               as const,
  lists:   ()                          => ["collections", "list"]       as const,
  list:    (p: CollectionListParams)   => ["collections", "list", p]    as const,
  details: ()                          => ["collections", "detail"]     as const,
  detail:  (id: string)                => ["collections", "detail", id] as const,
};

export const CollectionService = {
  getCollections(params?: CollectionListParams) {
    return api.get<CollectionListResponse>("/admin/collections", params);
  },

  getCollection(id: string) {
    return api.get<CollectionSingleResponse>(`/admin/collections/${id}`);
  },

  createCollection(data: CreateCollectionRequest | FormData) {
    return api.post<CollectionSingleResponse>("/admin/collections", data);
  },

  updateCollection(id: string, data: UpdateCollectionRequest | FormData) {
    return api.patch<CollectionSingleResponse>(`/admin/collections/${id}`, data);
  },

  deleteCollection(id: string) {
    return api.delete<CollectionDeleteResponse>(`/admin/collections/${id}`);
  },
};

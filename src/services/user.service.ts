import { api } from "./api";
import type {
  UserListResponse,
  UserSingleResponse,
  CurrentUser,
  CreateUserRequest,
  UpdateUserRequest,
  AssignRolesRequest,
} from "@/types/user.types";

export const userKeys = {
  all:      ()                      => ["users"]               as const,
  lists:    ()                      => ["users", "list"]       as const,
  list:     (p?: Record<string, string>) => ["users", "list", p] as const,
  details:  ()                      => ["users", "detail"]     as const,
  detail:   (id: string)            => ["users", "detail", id]   as const,
  current:  ()                      => ["users", "me"]         as const,
};

export const UserService = {
  getUsers() {
    return api.get<UserListResponse>("/admin/users");
  },

  getUser(id: string) {
    return api.get<UserSingleResponse>(`/admin/users/${id}`);
  },

  createUser(data: CreateUserRequest) {
    return api.post<UserSingleResponse>("/admin/users", data);
  },

  updateUser(id: string, data: UpdateUserRequest) {
    return api.patch<UserSingleResponse>(`/admin/users/${id}`, data);
  },

  deleteUser(id: string) {
    return api.delete<void>(`/admin/users/${id}`);
  },

  assignRoles(id: string, data: AssignRolesRequest) {
    return api.post<UserSingleResponse>(`/admin/users/${id}/roles`, data);
  },

  removeRoles(id: string, data: AssignRolesRequest) {
    return api.delete<UserSingleResponse>(`/admin/users/${id}/roles`, { data });
  },

  getCurrentUser() {
    return api.get<{ statusCode: number; message: string; data: CurrentUser }>("/admin/users/me");
  },
};

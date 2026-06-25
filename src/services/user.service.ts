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

  async updateUser(id: string, data: UpdateUserRequest) {
    const currentData = { ...data };
    if (data.avatarFile) {
      const formData = new FormData();
      formData.append("avatar", data.avatarFile);
      const res = await api.patch<UserSingleResponse>(`/admin/users/${id}`, formData);
      if (res?.data?.avatar) {
        currentData.avatar = res.data.avatar;
      }
    }
    const { avatarFile, ...jsonData } = currentData;
    return api.patch<UserSingleResponse>(`/admin/users/${id}`, jsonData);
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
    return api.get<{ statusCode: number; message: string; data: CurrentUser }>("/admin/profile");
  },

  updateProfile(data: { name?: string; email?: string; mobile?: string; avatarFile?: File }) {
    if (data.avatarFile) {
      const formData = new FormData();
      if (data.name !== undefined) formData.append("name", data.name);
      if (data.email !== undefined) formData.append("email", data.email);
      if (data.mobile !== undefined) formData.append("mobile", data.mobile);
      formData.append("avatar", data.avatarFile);
      return api.patch<{ statusCode: number; message: string; data: CurrentUser }>("/admin/profile", formData);
    }
    const {    ...jsonData } = data;
    return api.patch<{ statusCode: number; message: string; data: CurrentUser }>("/admin/profile", jsonData);
  },

  changePassword(data: { currentPassword?: string; newPassword: string }) {
    return api.put<{ statusCode: number; message: string }>("/admin/profile/password", data);
  },
};

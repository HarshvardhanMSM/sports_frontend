"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService, userKeys } from "@/services/user.service";
import { useToast } from "@/components/common/Toast/useToast";
import { normalizeApiError } from "@/lib/errors/error-handler";
import type { CreateUserRequest, UpdateUserRequest, AssignRolesRequest } from "@/types/user.types";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => UserService.getUsers(),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => UserService.getUser(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => UserService.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all() });
      toast.success("User created successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateUserRequest) =>
      UserService.updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all() });
      toast.success("User updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all() });
      toast.success("User deleted successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useAssignRoles() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & AssignRolesRequest) =>
      UserService.assignRoles(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all() });
      toast.success("Roles assigned successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useRemoveRoles() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & AssignRolesRequest) =>
      UserService.removeRoles(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all() });
      toast.success("Roles removed successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; mobile?: string; avatarFile?: File }) =>
      UserService.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.current() });
      toast.success("Profile updated successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

export function useChangePassword() {
  const toast = useToast();
  return useMutation({
    mutationFn: (data: { currentPassword?: string; newPassword: string }) =>
      UserService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error) => {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message, normalized.errors.length ? normalized.errors : undefined);
    },
  });
}

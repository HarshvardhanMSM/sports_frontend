"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService, userKeys } from "@/services/user.service";
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
  return useMutation({
    mutationFn: (data: CreateUserRequest) => UserService.createUser(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateUserRequest) =>
      UserService.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
  });
}

export function useAssignRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & AssignRolesRequest) =>
      UserService.assignRoles(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
  });
}

export function useRemoveRoles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & AssignRolesRequest) =>
      UserService.removeRoles(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all() }),
  });
}

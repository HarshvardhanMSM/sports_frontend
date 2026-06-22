export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mobile?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface UserRole {
  id: string;
  name: string;
}

export interface UserListResponse {
  statusCode: number;
  message: string;
  data: User[];
}

export interface UserSingleResponse {
  statusCode: number;
  message: string;
  data: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  isActive?: boolean;
  avatar?: string;
  avatarFile?: File;
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mobile?: string;
  roles: UserRole[];
  permissions: string[];
}

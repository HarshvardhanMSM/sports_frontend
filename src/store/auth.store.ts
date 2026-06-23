"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth.types";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth-cookie";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  isPermissionsLoaded: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setProfile: (user: User) => void;
  hasPermission: (slug: string) => boolean;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const INITIAL: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  permissions: [],
  isPermissionsLoaded: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      setAuth: (user, accessToken, refreshToken) => {
        setAuthCookie(accessToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      setTokens: (accessToken, refreshToken) => {
        setAuthCookie(accessToken);
        set((prev) => ({
          accessToken,
          refreshToken: refreshToken ?? prev.refreshToken,
        }));
      },

      setProfile: (user) => {
        set({
          user,
          permissions: user.permissions?.map((p) => p.slug) ?? [],
          isPermissionsLoaded: true,
        });
      },

      hasPermission: (slug: string) => {
        const state = get();
        if (!state.isPermissionsLoaded) return true;
       
        
        const isSuperAdmin = state.user?.roles?.find(
          (r) => r.slug === "super_admin",
        );
        if (isSuperAdmin?.slug) return true;
        return state.permissions.includes(slug);
      },

      logout: () => {
        clearAuthCookie();
        set(INITIAL);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const selectUser = (s: AuthStore) => s.user;
export const selectAccessToken = (s: AuthStore) => s.accessToken;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;

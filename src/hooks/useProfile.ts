"use client";

import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useAuthStore, selectAccessToken } from "@/store/auth.store";
import { useEffect } from "react";

export const profileKeys = {
  all: () => ["profile"] as const,
};

export function useProfile() {
  const accessToken = useAuthStore(selectAccessToken);
  const setProfile = useAuthStore((s) => s.setProfile);

  const query = useQuery({
    queryKey: profileKeys.all(),
    queryFn: () => AuthService.getProfile(),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setProfile(query.data);
    }
  }, [query.data, setProfile]);

  return query;
}

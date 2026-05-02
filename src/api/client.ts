import axios from "axios";
import { router } from "expo-router";

import { API_BASE_URL } from "./config";
import { postRefreshToken } from "./refreshSession";
import { useAuthStore } from "../state/authStore";

export const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 30_000,
});

function isPublicAuthPath(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("/api/user/login/email") ||
    url.includes("/api/user/register/email") ||
    url.includes("/api/user/login/google") ||
    url.includes("/api/user/register/google") ||
    url.includes("/api/user/refresh")
  );
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSessionOnce(): Promise<boolean> {
  const rt = useAuthStore.getState().refreshToken?.trim();
  if (!rt) return false;
  try {
    const data = await postRefreshToken(rt);
    const accessToken = data.token ?? data.accessToken ?? null;
    const newRefresh = data.refreshToken?.trim() || rt;
    if (!accessToken) return false;
    const prev = useAuthStore.getState();
    await prev.login({
      accessToken,
      refreshToken: newRefresh,
      user: prev.user,
    });
    return true;
  } catch {
    return false;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: unknown) => {
    const err = error as {
      response?: { status?: number };
      config?: {
        url?: string;
        __isRetryAfterRefresh?: boolean;
        headers?: Record<string, string>;
      };
    };
    const status = err?.response?.status;
    const cfg = err?.config;
    const url = cfg?.url ?? "";

    if (
      status === 401 &&
      !isPublicAuthPath(url) &&
      !cfg?.__isRetryAfterRefresh
    ) {
      const {
        isAuthenticated,
        accessToken,
        refreshToken,
        logout,
      } = useAuthStore.getState();
      const hadSession = Boolean(
        isAuthenticated && (accessToken || refreshToken),
      );

      if (hadSession && refreshToken?.trim()) {
        if (!refreshInFlight) {
          refreshInFlight = refreshSessionOnce().finally(() => {
            refreshInFlight = null;
          });
        }
        const ok = await refreshInFlight;
        if (ok && cfg) {
          cfg.__isRetryAfterRefresh = true;
          cfg.headers = cfg.headers ?? {};
          cfg.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
          return api.request(cfg as any);
        }
      }

      if (hadSession) {
        await logout();
        router.replace("/Login");
      }
    }
    return Promise.reject(error);
  },
);

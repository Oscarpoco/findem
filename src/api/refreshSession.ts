import axios from "axios";

import { API_BASE_URL } from "./config";

export async function postRefreshToken(refreshToken: string): Promise<{
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  uid?: string;
  user?: { email?: string | null };
}> {
  const base = (API_BASE_URL || "").replace(/\/$/, "");
  if (!base) {
    throw new Error("API URL is not configured");
  }
  const { data } = await axios.post(
    `${base}/api/user/refresh`,
    { refreshToken },
    {
      timeout: 30_000,
      headers: { "Content-Type": "application/json" },
    }
  );
  return data ?? {};
}

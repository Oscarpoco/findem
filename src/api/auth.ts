import { api } from "./client";

export type LoginRequest = { email: string; password: string };

/** Same contract as POST /api/user/login/email — prefer `user.ts` `loginWithEmail` in app code. */
export type LoginResponse = {
  token?: string;
  accessToken?: string;
  uid?: string;
  user?: Record<string, unknown>;
  message?: string;
};

export async function loginWithEmailPassword(
  body: LoginRequest
): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/api/user/login/email", body);
  return res.data;
}

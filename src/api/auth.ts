import { api } from "./client";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  accessToken: string;
  user?: { id: string; email?: string | null };
};

export async function loginWithEmailPassword(body: LoginRequest): Promise<LoginResponse> {
  // Adjust this endpoint to your backend.
  const res = await api.post<LoginResponse>("/auth/login", body);
  return res.data;
}


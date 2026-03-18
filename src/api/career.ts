import { api } from "./client";

export type NormalizedAuth = {
  accessToken: string | null;
  uid: string | null;
  email: string | null;
};

export function normalizeAuthResponse(
  raw: any,
  fallback: { email?: string | null } = {}
): NormalizedAuth {
  const data = raw?.data ?? raw;

  const accessToken: string | null =
    data?.accessToken ?? data?.token ?? data?.data?.accessToken ?? data?.data?.token ?? null;

  const user = data?.user ?? data?.data?.user ?? null;

  const uid: string | null =
    user?.id ??
    user?.uid ??
    data?.uid ??
    data?.userId ??
    data?.data?.uid ??
    data?.data?.userId ??
    null;

  const email: string | null =
    user?.email ?? data?.email ?? data?.data?.email ?? fallback.email ?? null;

  return { accessToken, uid, email };
}

export type CreateCareerRequest = {
  uid: string;
  path: string;
};

export type CreateCareerResponse = {
  data?: any;
  message?: string;
};

export async function createCareerPath(
  body: CreateCareerRequest
): Promise<CreateCareerResponse> {
  const res = await api.post<CreateCareerResponse>("/api/career", body);
  return res.data;
}


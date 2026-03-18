import { api } from "./client";

function extractErrorMessage(data: any): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;

  const errs = data?.errors;
  if (Array.isArray(errs)) {
    const parts = errs
      .map((e) => {
        if (!e) return null;
        if (typeof e === "string") return e;
        const msg = e.message ?? e.msg ?? e.error ?? e.detail;
        const field = e.field ?? e.path ?? e.param;
        if (msg && field) return `${field}: ${msg}`;
        if (msg) return String(msg);
        return null;
      })
      .filter(Boolean) as string[];
    if (parts.length) return parts.join("\n");
  }

  return null;
}

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

export type RegisterEmailRequest = {
  email: string;
  password: string;
  displayName?: string;
  identityNumber?: string;
};

// Response shape is backend-defined; keep flexible.
export type RegisterEmailResponse = {
  accessToken?: string;
  token?: string;
  user?: { id?: string; email?: string | null };
  data?: any;
  message?: string;
};

export async function registerWithEmail(
  body: RegisterEmailRequest
): Promise<RegisterEmailResponse> {
  try {
    const res = await api.post<RegisterEmailResponse>(
      "/api/user/register/email",
      body
    );

    return res.data;
  } catch (error: any) {
    const data = error?.response?.data;

    const nice = extractErrorMessage(data);
    if (nice) {
      const wrapped = new Error(nice);
      (wrapped as any).response = error?.response;
      throw wrapped;
    }

    throw error;
  }
}

export type LoginEmailRequest = {
  email: string;
  password: string;
};

export type LoginEmailResponse = {
  accessToken?: string;
  token?: string;
  user?: { id?: string; email?: string | null };
  data?: any;
  message?: string;
};

export async function loginWithEmail(
  body: LoginEmailRequest
): Promise<LoginEmailResponse> {
  const res = await api.post<LoginEmailResponse>("/api/user/login/email", body);
  return res.data;
}

export type UpdateProfileRequest = {
  uid: string;
  displayName: string;
  phoneNumber: string;
  province: string;
  city: string;
  identityNumber: string;
};

export type UpdateProfileResponse = {
  user?: { uid?: string; email?: string | null };
  data?: any;
  message?: string;
};

export async function updateUserProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const res = await api.put<UpdateProfileResponse>("/api/user/profile", body);
  return res.data;
}


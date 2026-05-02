import { api } from "./client";

export type CreateCareerRequest = {
  uid: string;
  path: string;
  /** When set, must match a CMS `career_categories` document id. */
  categoryId?: string;
};

export type CreateCareerResponse = {
  data?: any;
  message?: string;
};

export type MyCareerDto = {
  id: string;
  uid: string;
  path: string;
  categoryId: string | null;
};

export async function fetchMyCareer(): Promise<MyCareerDto | null> {
  const { data } = await api.get<{ message: string; data: MyCareerDto | null }>(
    "/api/career/me",
  );
  return data.data ?? null;
}

export async function createCareerPath(
  body: CreateCareerRequest
): Promise<CreateCareerResponse> {
  const res = await api.post<CreateCareerResponse>("/api/career", body);
  return res.data;
}


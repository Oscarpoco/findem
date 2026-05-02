import { api } from "./client";
import type { LearningModuleDto } from "../types/learningModule";

type ListResponse = {
  message: string;
  data: LearningModuleDto[];
};

type GetResponse = {
  message: string;
  data: LearningModuleDto;
};

export async function listLearningModulesByCategory(
  categoryId: string,
): Promise<LearningModuleDto[]> {
  const { data } = await api.get<ListResponse>(
    `/api/learning/modules/category/${encodeURIComponent(categoryId)}`,
  );
  return Array.isArray(data.data) ? data.data : [];
}

export async function getLearningModule(id: string): Promise<LearningModuleDto> {
  const { data } = await api.get<GetResponse>(
    `/api/learning/modules/${encodeURIComponent(id)}`,
  );
  return data.data;
}

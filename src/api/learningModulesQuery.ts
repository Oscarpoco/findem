export const learningModulesQueryKeys = {
  all: ["learningModules"] as const,
  byCategory: (categoryId: string) =>
    [...learningModulesQueryKeys.all, "category", categoryId] as const,
};

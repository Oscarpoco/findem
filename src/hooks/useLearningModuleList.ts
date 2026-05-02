import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { listLearningModulesByCategory } from "../api/learningModules";
import { learningModulesQueryKeys } from "../api/learningModulesQuery";
import {
  mapApiLearningModuleToTask,
  type LearningTask,
} from "../data/learningTasks";
import { useAuthStore } from "../state/authStore";
import { useProgressStore } from "../state/progressStore";

export function useLearningModuleList(): {
  tasks: LearningTask[];
  loadingRemote: boolean;
  refresh: () => Promise<void>;
} {
  const careerCategoryId = useAuthStore((s) => s.careerCategoryId);
  const progress = useProgressStore((s) => s.progress);
  const queryClient = useQueryClient();

  const categoryKey = careerCategoryId ?? "";

  const query = useQuery({
    queryKey: learningModulesQueryKeys.byCategory(categoryKey),
    queryFn: async () => {
      const cat = useAuthStore.getState().careerCategoryId;
      if (!cat) return [];
      return listLearningModulesByCategory(cat);
    },
    enabled: Boolean(careerCategoryId),
  });

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await useAuthStore.getState().syncCareerFromApi();
        const cat = useAuthStore.getState().careerCategoryId;
        if (cat) {
          await queryClient.invalidateQueries({
            queryKey: learningModulesQueryKeys.byCategory(cat),
          });
        }
      })();
    }, [queryClient]),
  );

  const tasks = useMemo(() => {
    if (!careerCategoryId) return [];
    const rows = query.data ?? [];
    return rows.map((r) =>
      mapApiLearningModuleToTask(r, progress[r.id] ?? 0),
    );
  }, [careerCategoryId, query.data, progress]);

  const loadingRemote =
    Boolean(careerCategoryId) && query.status === "pending";

  const refresh = useCallback(async () => {
    const cat = useAuthStore.getState().careerCategoryId;
    if (!cat) return;
    await queryClient.invalidateQueries({
      queryKey: learningModulesQueryKeys.byCategory(cat),
    });
  }, [queryClient]);

  return {
    tasks,
    loadingRemote,
    refresh,
  };
}

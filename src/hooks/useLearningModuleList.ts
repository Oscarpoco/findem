import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { listLearningModulesByCategory } from "../api/learningModules";
import {
  mapApiLearningModuleToTask,
  type LearningTask,
} from "../data/learningTasks";
import type { LearningModuleDto } from "../types/learningModule";
import { useAuthStore } from "../state/authStore";
import { useProgressStore } from "../state/progressStore";

export function useLearningModuleList(): {
  tasks: LearningTask[];
  loadingRemote: boolean;
  refresh: () => Promise<void>;
} {
  const careerCategoryId = useAuthStore((s) => s.careerCategoryId);
  const progress = useProgressStore((s) => s.progress);
  const [remoteRows, setRemoteRows] = useState<LearningModuleDto[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(false);

  const loadRemote = useCallback(async () => {
    if (!careerCategoryId) {
      setRemoteRows([]);
      return;
    }
    setLoadingRemote(true);
    try {
      const rows = await listLearningModulesByCategory(careerCategoryId);
      setRemoteRows(rows);
    } catch {
      setRemoteRows([]);
    } finally {
      setLoadingRemote(false);
    }
  }, [careerCategoryId]);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await useAuthStore.getState().syncCareerFromApi();
        await loadRemote();
      })();
    }, [loadRemote]),
  );

  const tasks = useMemo(() => {
    if (!careerCategoryId) return [];
    return remoteRows.map((r) =>
      mapApiLearningModuleToTask(r, progress[r.id] ?? 0),
    );
  }, [careerCategoryId, remoteRows, progress]);

  return {
    tasks,
    loadingRemote: Boolean(careerCategoryId) && loadingRemote,
    refresh: loadRemote,
  };
}

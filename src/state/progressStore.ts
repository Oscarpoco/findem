import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "./keys";
import { zustandStorage } from "./zustandStorage";

export type ProgressState = {
  progress: Record<number, number>; // taskId -> progress (0-100)

  setProgress: (taskId: number, progress: number) => void;
  getProgress: (taskId: number) => number;
  resetProgress: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      setProgress: (taskId, progress) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [taskId]: Math.min(100, Math.max(0, progress)),
          },
        }));
      },

      getProgress: (taskId) => {
        return get().progress[taskId] || 0;
      },

      resetProgress: () => {
        set({ progress: {} });
      },
    }),
    {
      name: STORAGE_KEYS.learningProgress,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

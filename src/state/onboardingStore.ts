import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "./keys";
import { zustandStorage } from "./zustandStorage";

type OnboardingState = {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  complete: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: (completed) => set({ completed }),
      complete: () => set({ completed: true }),
      reset: () => set({ completed: false }),
    }),
    {
      name: STORAGE_KEYS.onboardingCompleted,
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
    }
  )
);


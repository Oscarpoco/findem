import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "./keys";
import { zustandStorage } from "./zustandStorage";

export type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: { id: string; email?: string | null } | null;
  profileCompleted: boolean;
  careerCompleted: boolean;

  hydrate: () => Promise<void>;
  login: (params: { accessToken?: string | null; user?: AuthState["user"] }) => Promise<void>;
  setProfileCompleted: (completed: boolean) => void;
  setCareerCompleted: (completed: boolean) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      profileCompleted: true,
      careerCompleted: true,

      hydrate: async () => {
        // Zustand persist hydrates automatically; this method exists for consistency
        // and for future migration logic.
        // Accessing state forces subscription usage patterns to remain stable.
        get();
      },

      login: async ({ accessToken = null, user = null }) => {
        set({
          isAuthenticated: true,
          accessToken,
          user,
        });
      },

      setProfileCompleted: (completed) => set({ profileCompleted: completed }),
      setCareerCompleted: (completed) => set({ careerCompleted: completed }),

      logout: async () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          user: null,
          profileCompleted: true,
          careerCompleted: true,
        });
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        user: state.user,
        profileCompleted: state.profileCompleted,
        careerCompleted: state.careerCompleted,
      }),
    }
  )
);


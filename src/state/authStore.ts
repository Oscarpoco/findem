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
  /** Firestore `career_categories` id when learner chose a CMS category. */
  careerCategoryId: string | null;
  /** Display label for the learner path (category name or custom path). */
  careerPathLabel: string | null;

  hydrate: () => Promise<void>;
  login: (params: { accessToken?: string | null; user?: AuthState["user"] }) => Promise<void>;
  /** Load career from API (path + categoryId) into local state; no-op on network error. */
  syncCareerFromApi: () => Promise<void>;
  setProfileCompleted: (completed: boolean) => void;
  setCareerCompleted: (completed: boolean) => void;
  /** Call after learner finishes Career Path setup (persists category + label, marks career complete). */
  setCareerAfterSetup: (p: { categoryId: string | null; pathLabel: string }) => void;
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
      careerCategoryId: null,
      careerPathLabel: null,

      hydrate: async () => {
        get();
      },

      login: async ({ accessToken = null, user = null }) => {
        set({
          isAuthenticated: true,
          accessToken,
          user,
        });
      },

      syncCareerFromApi: async () => {
        const token = get().accessToken;
        if (!token) return;
        try {
          const { fetchMyCareer } = await import("../api/career");
          const career = await fetchMyCareer();
          if (career) {
            set({
              careerCompleted: true,
              careerCategoryId: career.categoryId?.trim() || null,
              careerPathLabel: career.path?.trim() || null,
            });
          } else {
            set({
              careerCompleted: false,
              careerCategoryId: null,
              careerPathLabel: null,
            });
          }
        } catch {
          /* keep existing persisted career flags when offline / server error */
        }
      },

      setProfileCompleted: (completed) => set({ profileCompleted: completed }),
      setCareerCompleted: (completed) => set({ careerCompleted: completed }),

      setCareerAfterSetup: ({ categoryId, pathLabel }) =>
        set({
          careerCompleted: true,
          careerCategoryId: categoryId,
          careerPathLabel: pathLabel.trim() || null,
        }),

      logout: async () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          user: null,
          profileCompleted: true,
          careerCompleted: true,
          careerCategoryId: null,
          careerPathLabel: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        user: state.user,
        profileCompleted: state.profileCompleted,
        careerCompleted: state.careerCompleted,
        careerCategoryId: state.careerCategoryId,
        careerPathLabel: state.careerPathLabel,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AuthState>;
        const merged: AuthState = {
          ...current,
          ...p,
          careerCategoryId: p.careerCategoryId ?? null,
          careerPathLabel: p.careerPathLabel ?? null,
        };
        const token = merged.accessToken?.trim();
        const hasUser = Boolean(merged.user?.id);
        if (token && hasUser) merged.isAuthenticated = true;
        if (!token || !hasUser) merged.isAuthenticated = false;
        return merged;
      },
    }
  )
);

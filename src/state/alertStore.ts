import { create } from "zustand";

export type AlertType = "success" | "error" | "warning" | "info";

export type Alert = {
  id: string;
  type: AlertType;
  message: string;
  createdAt: number;
  durationMs?: number;
};

type AlertState = {
  alerts: Alert[];
  push: (alert: Omit<Alert, "id" | "createdAt">) => string;
  remove: (id: string) => void;
  clear: () => void;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  push: (alert) => {
    const id = makeId();
    const item: Alert = {
      id,
      createdAt: Date.now(),
      durationMs: 3500,
      ...alert,
    };
    set((state) => ({ alerts: [item, ...state.alerts].slice(0, 3) }));
    return id;
  },
  remove: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  clear: () => set({ alerts: [] }),
}));


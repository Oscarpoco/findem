import type { StateStorage } from "zustand/middleware";
import * as safeStorage from "./storage";

export const zustandStorage: StateStorage = {
  getItem: (name) => safeStorage.getItem(name),
  setItem: (name, value) => safeStorage.setItem(name, value),
  removeItem: (name) => safeStorage.removeItem(name),
};


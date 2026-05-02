import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

import { STORAGE_KEYS } from "./keys";

const SECURE_ACCESS_KEY = "findem_access_token_secure_v1";
const SECURE_REFRESH_KEY = "findem_refresh_token_secure_v1";

type PersistBlob = {
  state?: {
    accessToken?: string | null;
    refreshToken?: string | null;
  };
  version?: number;
};

async function readAccessFromSecure(): Promise<string | null> {
  if ((Platform.OS as string) === "web") return null;
  try {
    const t = await SecureStore.getItemAsync(SECURE_ACCESS_KEY);
    return t && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

async function readRefreshFromSecure(): Promise<string | null> {
  if ((Platform.OS as string) === "web") return null;
  try {
    const t = await SecureStore.getItemAsync(SECURE_REFRESH_KEY);
    return t && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

async function writeTokensToSecure(
  access: string | null,
  refresh: string | null
): Promise<void> {
  if ((Platform.OS as string) === "web") return;
  const opts = {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  } as const;
  try {
    if (access && access.length > 0) {
      await SecureStore.setItemAsync(SECURE_ACCESS_KEY, access, opts);
    } else {
      await SecureStore.deleteItemAsync(SECURE_ACCESS_KEY);
    }
    if (refresh && refresh.length > 0) {
      await SecureStore.setItemAsync(SECURE_REFRESH_KEY, refresh, opts);
    } else {
      await SecureStore.deleteItemAsync(SECURE_REFRESH_KEY);
    }
  } catch {
    /* Keychain / keystore unavailable */
  }
}

/**
 * Zustand persist: access + refresh tokens in SecureStore (native); other auth fields in AsyncStorage.
 * Web keeps both tokens in persisted JSON.
 */
export const authPersistStorage: StateStorage = {
  getItem: async (name) => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw || name !== STORAGE_KEYS.auth) return raw;
    if ((Platform.OS as string) === "web") return raw;

    try {
      const parsed = JSON.parse(raw) as PersistBlob;
      let access = await readAccessFromSecure();
      let refresh = await readRefreshFromSecure();
      const inlineA = parsed?.state?.accessToken;
      const inlineR = parsed?.state?.refreshToken;

      if (!access && typeof inlineA === "string" && inlineA.length > 0) {
        access = inlineA;
      }
      if (!refresh && typeof inlineR === "string" && inlineR.length > 0) {
        refresh = inlineR;
      }

      if (
        (access && typeof inlineA === "string" && inlineA.length > 0) ||
        (refresh && typeof inlineR === "string" && inlineR.length > 0)
      ) {
        await writeTokensToSecure(
          access ?? null,
          refresh ?? null
        );
        const cleared: PersistBlob = {
          ...parsed,
          state: parsed.state
            ? {
                ...parsed.state,
                accessToken: null,
                refreshToken: null,
              }
            : undefined,
        };
        await AsyncStorage.setItem(name, JSON.stringify(cleared));
      }

      if (parsed.state && (access || refresh)) {
        return JSON.stringify({
          ...parsed,
          state: {
            ...parsed.state,
            accessToken: access ?? null,
            refreshToken: refresh ?? null,
          },
        });
      }
      return raw;
    } catch {
      return raw;
    }
  },

  setItem: async (name, value) => {
    if (name !== STORAGE_KEYS.auth) {
      await AsyncStorage.setItem(name, value);
      return;
    }

    if ((Platform.OS as string) === "web") {
      await AsyncStorage.setItem(name, value);
      return;
    }

    try {
      const parsed = JSON.parse(value) as PersistBlob;
      const access =
        typeof parsed?.state?.accessToken === "string"
          ? parsed.state.accessToken
          : null;
      const refresh =
        typeof parsed?.state?.refreshToken === "string"
          ? parsed.state.refreshToken
          : null;
      await writeTokensToSecure(access, refresh);
      const toStore: PersistBlob = {
        ...parsed,
        state: parsed.state
          ? {
              ...parsed.state,
              accessToken: null,
              refreshToken: null,
            }
          : undefined,
      };
      await AsyncStorage.setItem(name, JSON.stringify(toStore));
    } catch {
      await AsyncStorage.setItem(name, value);
    }
  },

  removeItem: async (name) => {
    if (name === STORAGE_KEYS.auth) {
      await writeTokensToSecure(null, null);
    }
    await AsyncStorage.removeItem(name);
  },
};

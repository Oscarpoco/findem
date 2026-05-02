/**
 * Central env access + light validation. Use EXPO_PUBLIC_* vars (Expo injects at bundle time).
 */
const rawApi = process.env.EXPO_PUBLIC_API_URL;
const rawSentry = process.env.EXPO_PUBLIC_SENTRY_DSN;
const rawSentryDev =
  process.env.EXPO_PUBLIC_SENTRY_DEV === "1" ||
  process.env.EXPO_PUBLIC_SENTRY_DEV === "true";

if (__DEV__ && !rawApi) {
  console.warn(
    "[Findem] EXPO_PUBLIC_API_URL is not set. API calls will fail until you configure .env."
  );
}

export const EXPO_PUBLIC_API_URL = rawApi ?? "";
export const EXPO_PUBLIC_SENTRY_DSN = rawSentry ?? "";
export const SENTRY_ENABLED_IN_DEV = rawSentryDev;

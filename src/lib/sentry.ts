import * as Sentry from "@sentry/react-native";

import {
  EXPO_PUBLIC_SENTRY_DSN,
  SENTRY_ENABLED_IN_DEV,
} from "./env";

let initialized = false;

export function initSentry(): void {
  if (initialized || !EXPO_PUBLIC_SENTRY_DSN) return;
  initialized = true;
  const enabled = !__DEV__ || SENTRY_ENABLED_IN_DEV;
  Sentry.init({
    dsn: EXPO_PUBLIC_SENTRY_DSN,
    debug: __DEV__,
    enabled,
    tracesSampleRate: 0.15,
  });
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!EXPO_PUBLIC_SENTRY_DSN) return;
  initSentry();
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

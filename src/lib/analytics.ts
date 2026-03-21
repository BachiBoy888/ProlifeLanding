import * as amplitude from '@amplitude/analytics-browser';

// Module-level flag — persists across React StrictMode remounts
let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY as string | undefined;
  if (!apiKey) return;
  amplitude.init(apiKey, undefined, {
    defaultTracking: false,
  });
  initialized = true;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  if (!initialized) return;
  amplitude.track(eventName, properties);
}

export function setUserProperties(props: Record<string, unknown>): void {
  if (!initialized) return;
  const identify = new amplitude.Identify();
  for (const [key, value] of Object.entries(props)) {
    identify.set(key, value as string | number | boolean);
  }
  amplitude.identify(identify);
}

import * as amplitude from '@amplitude/analytics-browser';

// Module-level flag — persists across React StrictMode remounts
let initialized = false;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
const SESSION_KEY = 'amp_utm';

export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(utm));
  }
}

export function getUtmParams(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

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

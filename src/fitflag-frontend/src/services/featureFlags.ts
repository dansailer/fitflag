import { OpenFeature } from '@openfeature/web-sdk';
import { FlagdWebProvider } from '@openfeature/flagd-web-provider';

let initialized = false;

export async function initializeFeatureFlags() {
  if (initialized) return;

const provider = new FlagdWebProvider({
    host: import.meta.env.VITE_FLAGD_HOST || 'localhost',
    pathPrefix: import.meta.env.VITE_FLAGD_PATH_PREFIX || '',
    port: parseInt(import.meta.env.VITE_FLAGD_PORT || '8013', 10),
    tls: import.meta.env.VITE_FLAGD_TLS === 'true',
    maxRetries: parseInt(import.meta.env.VITE_FLAGD_MAX_RETRIES || '3', 10),
});

  await OpenFeature.setProviderAndWait(provider);
  initialized = true;
  
  if (import.meta.env.DEV) {
    console.log('[flagd] Connected to flagd OFREP API at localhost:8016');
  }
}

export function getFeatureFlagClient() {
  return OpenFeature.getClient();
}

export function getCurrentContext() {
  return OpenFeature.getContext();
}

export async function setUserContext(role: string) {
  await OpenFeature.setContext({ role });
  localStorage.setItem('userRole', role);
  if (import.meta.env.DEV) {
    console.log('[flagd] Context updated:', { role });
  }
}

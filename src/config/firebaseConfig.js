// Optional deployment config for Vercel / Netlify.
// Set window.__SKYFORGE_CLOUD_CONFIG__ in index.html or inject via build env vars so keys stay out of GitHub.

function cleanEnvValue(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || (trimmed.startsWith('%VITE_') && trimmed.endsWith('%'))) {
    return '';
  }
  return trimmed;
}

function getEnvCloudConfig() {
  if (typeof window !== 'undefined' && window.__SKYFORGE_CLOUD_CONFIG__) {
    return window.__SKYFORGE_CLOUD_CONFIG__;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }
  if (typeof process !== 'undefined' && process.env) {
    return {
      apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || '',
      authDomain:
        process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
      projectId:
        process.env.VITE_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
      storageBucket:
        process.env.VITE_FIREBASE_STORAGE_BUCKET ||
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
        '',
      messagingSenderId:
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
        process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ||
        '',
      appId: process.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || ''
    };
  }
  return null;
}

const ENV_CLOUD_CONFIG = getEnvCloudConfig();

export const DEPLOYED_CLOUD_CONFIG = {
  apiKey: cleanEnvValue(ENV_CLOUD_CONFIG?.apiKey),
  authDomain: cleanEnvValue(ENV_CLOUD_CONFIG?.authDomain),
  projectId: cleanEnvValue(ENV_CLOUD_CONFIG?.projectId),
  storageBucket: cleanEnvValue(ENV_CLOUD_CONFIG?.storageBucket),
  messagingSenderId: cleanEnvValue(ENV_CLOUD_CONFIG?.messagingSenderId),
  appId: cleanEnvValue(ENV_CLOUD_CONFIG?.appId)
};

export function resolveActiveFirebaseConfig() {
  const rawGlobal =
    typeof globalThis !== 'undefined' &&
    typeof globalThis.__firebase_config !== 'undefined' &&
    globalThis.__firebase_config
      ? JSON.parse(globalThis.__firebase_config)
      : null;

  if (rawGlobal && rawGlobal.apiKey) {
    return rawGlobal;
  }
  if (DEPLOYED_CLOUD_CONFIG.apiKey) {
    return DEPLOYED_CLOUD_CONFIG;
  }
  return null;
}

export function resolveCloudAppId() {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.__app_id !== 'undefined' &&
    globalThis.__app_id
  ) {
    return globalThis.__app_id;
  }
  return 'skyforge-whiterun';
}

export function resolveInitialAuthToken() {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.__initial_auth_token !== 'undefined' &&
    globalThis.__initial_auth_token
  ) {
    return globalThis.__initial_auth_token;
  }
  return null;
}

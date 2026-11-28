const LOCAL_PREFIX = 'skyforge_v14_';

export function readLocalLedger(key, fallback) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(`${LOCAL_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalLedgerSnapshot(snapshot) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    Object.entries(snapshot).forEach(([key, value]) => {
      window.localStorage.setItem(`${LOCAL_PREFIX}${key}`, JSON.stringify(value));
    });
  } catch {
    // Ignore quota / private-mode storage errors
  }
}

export function readSessionJson(key, fallback = null) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return fallback;
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function readSessionBool(key, fallback = false) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return fallback;
    return window.sessionStorage.getItem(key) === 'true';
  } catch {
    return fallback;
  }
}

export function writeSessionValue(key, value) {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    if (value === null || value === undefined) {
      window.sessionStorage.removeItem(key);
    } else if (typeof value === 'string') {
      window.sessionStorage.setItem(key, value);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage errors
  }
}

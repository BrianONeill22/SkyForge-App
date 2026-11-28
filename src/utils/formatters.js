export const ROUND_TO_FIVE_THRESHOLD = 50;

export function roundToNearestFive(amount, minThreshold = ROUND_TO_FIVE_THRESHOLD) {
  const num = Number(amount) || 0;
  if (num <= 0) return 0;
  if (num < minThreshold) {
    return Math.max(1, Math.round(num));
  }
  return Math.round(num / 5) * 5;
}

export function getLocalDateString(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

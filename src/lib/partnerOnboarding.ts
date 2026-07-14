export const PARTNER_CATEGORIES = [
  "Halwai", "Caterer", "Decorator", "Photographer", "Makeup Artist",
  "Mehndi Artist", "DJ & Music", "Venue", "Pandit", "Event Planner",
] as const;

export function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return value.startsWith("+") ? `+${digits}` : value;
}

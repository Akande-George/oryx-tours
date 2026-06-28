export const formatPrice = (value: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

// Human-readable tour duration. Prefers the optional free-text `duration`
// (e.g. "8 hours") and falls back to the numeric day count.
export const formatDuration = (tour: {
  duration?: string | null;
  durationDays: number;
}) => {
  const text = tour.duration?.trim();
  if (text) return text;
  return `${tour.durationDays} day${tour.durationDays === 1 ? "" : "s"}`;
};

export const formatCompactDate = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

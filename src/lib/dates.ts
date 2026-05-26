export function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function parseDateParam(value: string | null, fallback = new Date()) {
  if (!value) return startOfDay(fallback);

  let date: Date;

  // Case 1: YYYY-MM-DD (recommended input format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    date = new Date(Date.UTC(y, m - 1, d));
  }

  // Case 2: full ISO string
  else if (!Number.isNaN(Date.parse(value))) {
    date = new Date(value);
  }

  // fallback
  else {
    return startOfDay(fallback);
  }

  return startOfDay(date);
}
export function monthRange(month: string | null) {
  const source =
    month && /^\d{4}-\d{2}$/.test(month)
      ? month
      : new Date().toISOString().slice(0, 7);
  const start = new Date(`${source}-01T00:00:00`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { label: source, start, end };
}

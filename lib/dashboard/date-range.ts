export type DatePreset = "today" | "this_week" | "this_month" | "custom";

export type DateRange = {
  from: string;
  to: string;
  preset: DatePreset;
};

function normalizeDateInput(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

function getDatePartsInTimeZone(date: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === "year")?.value ?? date.getUTCFullYear());
  const month = Number(parts.find((part) => part.type === "month")?.value ?? date.getUTCMonth() + 1);
  const day = Number(parts.find((part) => part.type === "day")?.value ?? date.getUTCDate());
  return { year, month, day };
}

function formatDatePart(date: Date, timeZone: string): string {
  const { year, month, day } = getDatePartsInTimeZone(date, timeZone);
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function zonedMidnightIso(datePart: string, timeZone: string): string {
  const normalized = normalizeDateInput(datePart);
  if (!normalized) return new Date().toISOString();
  const [year, month, day] = normalized.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(utcGuess);
  const tzYear = Number(parts.find((part) => part.type === "year")?.value ?? year);
  const tzMonth = Number(parts.find((part) => part.type === "month")?.value ?? month);
  const tzDay = Number(parts.find((part) => part.type === "day")?.value ?? day);
  const tzHour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const tzMinute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const tzSecond = Number(parts.find((part) => part.type === "second")?.value ?? 0);
  const tzAsUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond);
  const offset = tzAsUtc - utcGuess.getTime();
  return new Date(utcGuess.getTime() - offset).toISOString();
}

function addDays(datePart: string, days: number): string {
  const normalized = normalizeDateInput(datePart);
  if (!normalized) return datePart;
  const [year, month, day] = normalized.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear().toString().padStart(4, "0")}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`;
}

export function getTodayRange(timeZone = "Africa/Cairo"): DateRange {
  const today = formatDatePart(new Date(), timeZone);
  return { from: today, to: today, preset: "today" };
}

export function getThisWeekRange(timeZone = "Africa/Cairo"): DateRange {
  const today = formatDatePart(new Date(), timeZone);
  const utcToday = new Date(`${today}T00:00:00.000Z`);
  const day = utcToday.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = addDays(today, diff);
  return { from: start, to: today, preset: "this_week" };
}

export function getThisMonthRange(timeZone = "Africa/Cairo"): DateRange {
  const today = formatDatePart(new Date(), timeZone);
  const [year, month] = today.split("-").map(Number);
  const from = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-01`;
  return { from, to: today, preset: "this_month" };
}

export function parseDateRangeFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined> | null | undefined,
  timeZone = "Africa/Cairo",
): DateRange {
  const get = (key: string): string | null => {
    if (!searchParams) return null;
    if (searchParams instanceof URLSearchParams) return normalizeDateInput(searchParams.get(key));
    const value = searchParams[key];
    if (Array.isArray(value)) return normalizeDateInput(value[0]);
    return normalizeDateInput(value);
  };

  const preset = (searchParams instanceof URLSearchParams ? searchParams.get("preset") : (searchParams?.preset as string | undefined)) as DatePreset | null;
  const from = get("from");
  const to = get("to");

  if (from && to) {
    return { from, to, preset: (preset === "this_week" || preset === "this_month" || preset === "custom" || preset === "today") ? preset : "custom" };
  }

  if (preset === "this_week") return getThisWeekRange(timeZone);
  if (preset === "this_month") return getThisMonthRange(timeZone);
  if (preset === "custom" && from && to) return { from, to, preset };
  return getTodayRange(timeZone);
}

export function applyDateRangeToQuery(params: URLSearchParams, range: DateRange): URLSearchParams {
  const next = new URLSearchParams(params.toString());
  next.set("preset", range.preset);
  next.set("from", range.from);
  next.set("to", range.to);
  return next;
}

export function toDateFilterWindow(range: DateRange): { from: string; to: string } {
  return {
    from: zonedMidnightIso(range.from, "Africa/Cairo"),
    to: zonedMidnightIso(addDays(range.to, 1), "Africa/Cairo"),
  };
}

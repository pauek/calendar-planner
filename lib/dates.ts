import { titleize } from "./utils";

export type Semester = "spring" | "autumn";

export type SemesterMonth = {
  month: number;
  yearDif: number;
};

export type DateOnly = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
};

export type MaybeDate = DateOnly | null;

export const dateonly = (d: Date) => ({
  year: d.getFullYear(),
  month: 1 + d.getMonth(),
  day: d.getDate(),
});

export const dateOnly2date = (d: DateOnly) =>
  new Date(Date.UTC(d.year, d.month - 1, d.day));

//

export const getSemester = (d: DateOnly) =>
  d.month >= 2 && d.month < 8 ? "sprint" : "autumn";

export const nextMonth = (m: SemesterMonth): SemesterMonth => {
  if (m.month < 12) {
    return { month: m.month + 1, yearDif: m.yearDif };
  } else {
    return { month: 1, yearDif: m.yearDif + 1 };
  }
};

export const getMonthName = (month: SemesterMonth, locale: string = "ca") =>
  titleize(
    new Date(Date.UTC(2000 + month.yearDif, month.month - 1, 1)).toLocaleString(locale, {
      month: "long",
    })
  );

export const isWeekend = (date: MaybeDate) => {
  if (date === null) {
    return false;
  }
  const d = dateOnly2date(date);
  return d.getDay() === 6 || d.getDay() === 0;
};

export const isSunday = (date: MaybeDate) => {
  if (date === null) {
    return false;
  }
  const d = dateOnly2date(date);
  return d.getDay() === 0;
};

export const mkMonth = (month: number, nextYear: boolean = false) => ({
  month: month,
  yearDif: nextYear ? 1 : 0,
});

type SemesterMonths = {
  autumn: SemesterMonth[];
  spring: SemesterMonth[];
};
export const semesterMonths: SemesterMonths = {
  autumn: [mkMonth(9), mkMonth(10), mkMonth(11), mkMonth(12), mkMonth(1, true)],
  spring: [mkMonth(2), mkMonth(3), mkMonth(4), mkMonth(5), mkMonth(6), mkMonth(7)],
};

export const allDatesForMonth = (year: number, m: SemesterMonth) => {
  const result: DateOnly[] = [];
  const d = new Date(Date.UTC(year + m.yearDif, m.month - 1, 1));
  const next = nextMonth(m);
  const end = new Date(Date.UTC(year + next.yearDif, next.month - 1, 1));
  while (d < end) {
    result.push(dateonly(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
};

export const groupIntoWeeks = (dates: DateOnly[]) => {
  let week: MaybeDate[] = [];
  const result: MaybeDate[][] = [];
  for (const d of dates) {
    week.push(d);
    if (isSunday(d)) {
      result.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    result.push(week);
  }
  const firstWeek = result[0];
  if (firstWeek) {
    const padding: MaybeDate[] = Array.from({ length: 7 - firstWeek.length }).map(_ => null);
    firstWeek.splice(0, 0, ...padding);
  }
  const lastWeek = result[result.length - 1];
  if (lastWeek) {
    const padding: MaybeDate[] = Array.from({ length: 7 - lastWeek.length }).map(_ => null);
    lastWeek.splice(lastWeek.length, 0, ...padding);
  }
  return result;
};

export const mondayOfWeek = (dates: MaybeDate[]): DateOnly => {
  if (dates.length === 0) {
    throw new Error(`Empty dates!`);
  }
  const first = dates.find((d) => d !== null);
  if (!first) {
    throw new Error(`No undefined dates!`);
  }
  const result = dateOnly2date(first);
  const dif = result.getDay();
  if (dif > 1) {
    result.setDate(result.getDate() - (dif - 1));
  } else if (dif < 1) {
    result.setDate(result.getDate() + 1);
  }
  return dateonly(result);
};

export const weekDifference = (end: DateOnly, start: DateOnly): number => {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  const _end = dateOnly2date(end);
  const _start = dateOnly2date(start);
  const daysDiff = (_end.getTime() - _start.getTime()) / MILLIS_PER_DAY;
  return Math.floor(daysDiff / 7);
};

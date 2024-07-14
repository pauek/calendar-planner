import { titleize } from "./utils";

export type Semester = "spring" | "autumn";

export type Month = {
  month: number;
  yearDif: number;
};

export const getSemester = (date: Date) => {
  const month = 1 + date.getMonth();
  return month >= 2 && month < 8 ? "sprint" : "autumn";
};

export const nextMonth = (m: Month) => {
  if (m.month < 12) {
    return { month: m.month + 1, yearDif: m.yearDif };
  } else {
    return { month: 1, yearDif: m.yearDif + 1 };
  }
};

export const getMonthName = (month: Month, locale: string = "ca") =>
  titleize(
    new Date(Date.UTC(2000 + month.yearDif, month.month - 1, 1)).toLocaleString(locale, {
      month: "long",
    })
  );

export const isWeekend = (date: MaybeDate) =>
  date && (date.getDay() == 6 || date?.getDay() == 0);

export const mkMonth = (month: number, nextYear: boolean = false) => ({
  month: month,
  yearDif: nextYear ? 1 : 0,
});

type SemesterMonths = {
  autumn: Month[];
  spring: Month[];
};
export const semesterMonths: SemesterMonths = {
  autumn: [mkMonth(9), mkMonth(10), mkMonth(11), mkMonth(12), mkMonth(1, true)],
  spring: [mkMonth(2), mkMonth(3), mkMonth(4), mkMonth(5), mkMonth(6), mkMonth(7)],
};

export const allDatesForMonth = (year: number, m: Month) => {
  const result: Date[] = [];
  const d = new Date(Date.UTC(year + m.yearDif, m.month - 1, 1));
  const next = nextMonth(m);
  const end = new Date(Date.UTC(year + next.yearDif, next.month - 1, 1));
  while (d < end) {
    result.push(new Date(d.getTime()));
    d.setDate(d.getDate() + 1);
  }
  return result;
};

export type MaybeDate = Date | null;

export const groupIntoWeeks = (dates: Date[]) => {
  let week: MaybeDate[] = [];
  const result: MaybeDate[][] = [];
  for (const d of dates) {
    week.push(d);
    if (d.getDay() == 0) {
      result.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    result.push(week);
  }
  const firstWeek = result[0];
  if (firstWeek) {
    const padding: MaybeDate[] = Array.from({ length: 7 - firstWeek.length });
    firstWeek.splice(0, 0, ...padding);
  }
  const lastWeek = result[result.length - 1];
  if (lastWeek) {
    const padding: MaybeDate[] = Array.from({ length: 7 - lastWeek.length });
    lastWeek.splice(lastWeek.length, 0, ...padding);
  }
  return result;
};

export const firstOfWeek = (dates: MaybeDate[]) : Date => {
  if (dates.length === 0) {
    throw new Error(`Empty dates!`);
  }
  const first = dates.find((d) => d !== undefined);
  if (!first) {
    throw new Error(`No undefined dates!`);
  }
  const result = new Date(first.getTime());
  const dif = result.getDay();
  if (dif > 1) {
    result.setDate(result.getDate() - (dif - 1));
  } else if (dif < 1) {
    result.setDate(result.getDate() + 1);
  }
  return new Date(result.getTime());
}

export const weekDifference = (end: Date, start: Date): number => {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  const daysDiff = (end.getTime() - start.getTime()) / MILLIS_PER_DAY;
  return Math.floor(daysDiff / 7);
};

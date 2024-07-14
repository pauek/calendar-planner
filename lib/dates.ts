import { endDate, startDate } from "./config";
import { titleize } from "./utils";

export type WeekDay = "Dilluns" | "Dimarts" | "Dimecres" | "Dijous" | "Divendres";

export type Interval = {
  weekDay: WeekDay;
  startHour: number;
  endHour: number;
  lab: boolean;
};

export const weekDays: WeekDay[] = [
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
];

export const isContinuation = (
  interval: Interval | undefined,
  weekday: WeekDay,
  hour: number
) => {
  return interval && interval.weekDay === weekday && interval.endHour === hour;
};

export const weekHours: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export type Semester = "spring" | "autumn";

export type SemesterMonth = {
  month: number;
  yearDif: number;
};

export type AltDate = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
};

export type MaybeAltDate = AltDate | null;

export const date2altdate = (d: Date) => ({
  year: d.getFullYear(),
  month: 1 + d.getMonth(),
  day: d.getDate(),
});

export const isBefore = (d1: AltDate, d2: AltDate) => {
  if (d1.year != d2.year) return d1.year < d2.year;
  else if (d1.month != d2.month) return d1.month < d2.month;
  else return d1.day < d2.day;
};

export const altdate2date = (d: AltDate) =>
  new Date(Date.UTC(d.year, d.month - 1, d.day));

export const weekDay2index = (str: string): number => {
  const idx = weekDays.findIndex((day) => (day as string) === str);
  if (idx === -1) {
    throw new Error(`asWeekDay: "${str}" is not a weekday`);
  }
  return idx;
};

export const asWeekDay = (s: string): WeekDay => weekDays[weekDay2index(s)];

export const yearMonth = (year: number, month: SemesterMonth) => ({
  year: year + month.yearDif,
  month: month.month,
});

//

export const getSemester = (d: AltDate) =>
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

export const isWeekend = (date: MaybeAltDate) => {
  if (date === null) {
    return false;
  }
  const d = altdate2date(date);
  return d.getDay() === 6 || d.getDay() === 0;
};

export const isSunday = (date: MaybeAltDate) => {
  if (date === null) {
    return false;
  }
  const d = altdate2date(date);
  return d.getDay() === 0;
};

export const mkMonth = (month: number, nextYear: boolean = false) => ({
  month: month,
  yearDif: nextYear ? 1 : 0,
});

export const date2str = (d: AltDate): string => `${d.year}-${d.month}-${d.day}`;

type SemesterMonths = {
  autumn: SemesterMonth[];
  spring: SemesterMonth[];
};
export const semesterMonths: SemesterMonths = {
  autumn: [mkMonth(9), mkMonth(10), mkMonth(11), mkMonth(12), mkMonth(1, true)],
  spring: [mkMonth(2), mkMonth(3), mkMonth(4), mkMonth(5), mkMonth(6), mkMonth(7)],
};

export const allDatesForSemester = (year: number, semester: Semester) =>
  semesterMonths[semester].reduce<AltDate[]>(
    (acc, m) => acc.concat(allDatesForMonth(year, m)),
    []
  );

export const allDatesForMonth = (year: number, m: SemesterMonth) => {
  const result: AltDate[] = [];
  const next = nextMonth(m);

  let end = new Date(Date.UTC(year + next.yearDif, next.month - 1, 1));
  if (end > altdate2date(endDate)) {
    end = altdate2date(endDate);
  }

  let d = new Date(Date.UTC(year + m.yearDif, m.month - 1, 1));
  if (d < altdate2date(startDate)) {
    d = altdate2date(startDate);
  }
  
  while (d < end) {
    result.push(date2altdate(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
};

export const groupIntoWeeks = (dates: AltDate[]) => {
  let week: MaybeAltDate[] = [];
  const result: MaybeAltDate[][] = [];
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
    const padding: MaybeAltDate[] = Array.from({ length: 7 - firstWeek.length }).map(
      (_) => null
    );
    firstWeek.splice(0, 0, ...padding);
  }
  const lastWeek = result[result.length - 1];
  if (lastWeek) {
    const padding: MaybeAltDate[] = Array.from({ length: 7 - lastWeek.length }).map(
      (_) => null
    );
    lastWeek.splice(lastWeek.length, 0, ...padding);
  }
  return result;
};

export const mondayOfWeek = (dates: MaybeAltDate[]): AltDate => {
  if (dates.length === 0) {
    throw new Error(`Empty dates!`);
  }
  const first = dates.find((d) => d !== null);
  if (!first) {
    throw new Error(`No undefined dates!`);
  }
  const result = altdate2date(first);
  const dif = result.getDay();
  if (dif > 1) {
    result.setDate(result.getDate() - (dif - 1));
  } else if (dif < 1) {
    result.setDate(result.getDate() + 1);
  }
  return date2altdate(result);
};

export const weekDifference = (end: AltDate, start: AltDate): number => {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  const _end = altdate2date(end);
  const _start = altdate2date(start);
  const daysDiff = (_end.getTime() - _start.getTime()) / MILLIS_PER_DAY;
  return Math.floor(daysDiff / 7);
};

export const selectedHoursToIntervals = (selected: Set<string>): Interval[] => {
  const result: Interval[] = [];
  const list = [...selected.keys()];
  list.sort();

  let currInterval: Interval | undefined;
  for (const sel of list) {
    const [sday, shour] = sel.split(" ");
    const hour: number = Number(shour);
    console.log(sday, hour);
    if (isContinuation(currInterval, asWeekDay(sday), hour)) {
      currInterval!.endHour = hour + 1;
    } else {
      if (currInterval) {
        result.push(currInterval);
      }
      currInterval = {
        weekDay: asWeekDay(sday),
        startHour: hour,
        endHour: hour + 1,
        lab: false,
      };
      console.log(currInterval);
    }
  }
  if (currInterval) {
    result.push(currInterval);
  }
  return result;
};

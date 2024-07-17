import { GroupWithSlots } from "./db/courses"
import { SpecialDay } from "./db/special-days"
import { titleize } from "./utils"

export const WEEK_HOURS: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

export type WeekDay =
  | "Diumenge"
  | "Dilluns"
  | "Dimarts"
  | "Dimecres"
  | "Dijous"
  | "Divendres"
  | "Dissabte"

export const WEEK_DAYS: WeekDay[] = [
  "Diumenge",
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
]

export const WORK_DAYS = WEEK_DAYS.slice(1, 6)

export type Interval = {
  weekDay: WeekDay
  startHour: number
  endHour: number
  lab: boolean
}

export type Period = "spring" | "autumn"

export type SpecialDayType =
  | "no-class"
  | "semester-start"
  | "semester-end"
  | "classes-end"
  | "partial-exam"
  | "final-exam"

export type SemesterMonth = {
  month: number
  yearDif: number
}

// We use a type different than Date to avoid UTC issues (+2/-2 hours in comparisons),
// since we only deal with abstract dates, without clock.
export type AltDate = {
  year: number
  month: number // 1-12
  day: number // 1-31
}

export type MaybeAltDate = AltDate | null

export type Slot = {
  weekDay: number
  startHour: number
  endHour: number
}

export type Group = {
  group: string
  slots: Slot[]
}[]

type SemesterMonths = Record<Period, SemesterMonth[]>

export type SemesterWeek = {
  start: AltDate
  end: AltDate
}

//

export const isContinuation = (interval: Interval | undefined, weekday: WeekDay, hour: number) => {
  return interval && interval.weekDay === weekday && interval.endHour === hour
}

export const weekday = (d: AltDate) => altdate2date(d).getDay()

export const altDate = (year: number, month: number, day: number) => ({
  year,
  month,
  day,
})

export const date2altdate = (d: Date) => ({
  year: d.getFullYear(),
  month: 1 + d.getMonth(),
  day: d.getDate(),
})

export const hour2str = (weekday: string | undefined, hour: string | undefined) =>
  `${weekday} ${hour?.padStart(2, "0")}`

export const isLessThan = (d1: AltDate, d2: AltDate) => {
  if (d1.year != d2.year) return d1.year < d2.year
  else if (d1.month != d2.month) return d1.month < d2.month
  else return d1.day < d2.day
}

export const isLessThanOrEqual = (d1: AltDate, d2: AltDate) => {
  if (d1.year != d2.year) return d1.year <= d2.year
  else if (d1.month != d2.month) return d1.month <= d2.month
  else return d1.day <= d2.day
}

export const isBetween = (a: AltDate, b: AltDate, c: AltDate) =>
  isLessThan(a, b) && isLessThan(b, c)

export const isWithin = (low: AltDate | undefined, x: AltDate, high: AltDate | undefined) =>
  (!low || isLessThanOrEqual(low, x)) && (!high || isLessThanOrEqual(x, high))

export const altdate2date = (d: AltDate) => new Date(Date.UTC(d.year, d.month - 1, d.day))

export const weekDay2index = (str: string): number => {
  const idx = WEEK_DAYS.findIndex((day) => (day as string) === str)
  if (idx === -1) {
    throw new Error(`asWeekDay: "${str}" is not a weekday`)
  }
  return idx
}

export const asWeekDay = (s: string): WeekDay => WEEK_DAYS[weekDay2index(s)]

export const yearMonth = (year: number, month: SemesterMonth) => ({
  year: year + month.yearDif,
  month: month.month,
})

export const getSemester = (d: AltDate) => (d.month >= 2 && d.month < 8 ? "sprint" : "autumn")

export const nextMonth = (m: SemesterMonth): SemesterMonth => {
  if (m.month < 12) {
    return { month: m.month + 1, yearDif: m.yearDif }
  } else {
    return { month: 1, yearDif: m.yearDif + 1 }
  }
}

export const nextDay = (d: Date) => {
  const result = new Date(d.getTime())
  result.setDate(result.getDate() + 1)
  return result
}

export const getMonthName = (month: SemesterMonth, locale: string = "ca") =>
  titleize(
    new Date(Date.UTC(2000 + month.yearDif, month.month - 1, 1)).toLocaleString(locale, {
      month: "long",
    })
  )

export const isWeekend = (date: MaybeAltDate) => {
  if (date === null) {
    return false
  }
  const d = altdate2date(date)
  return d.getDay() === 6 || d.getDay() === 0
}

export const equalDates = (a: AltDate, b: AltDate) => {
  return a.day === b.day && a.month === b.month && a.year === b.year
}

export const dateInMonth = (d: AltDate, _year: number, m: SemesterMonth) => {
  const { year, month } = yearMonth(_year, m)
  return d.year === year && d.month === month
}

export const isTomorrow = (a: AltDate, b: AltDate | undefined) => {
  if (!b) {
    return false
  }
  const da = altdate2date(a)
  const db = altdate2date(b)
  return equalDates(date2altdate(nextDay(da)), date2altdate(db))
}

export const isSunday = (date: MaybeAltDate) => {
  if (date === null) {
    return false
  }
  const d = altdate2date(date)
  return d.getDay() === 0
}

export const mkMonth = (month: number, nextYear: boolean = false) => ({
  month: month,
  yearDif: nextYear ? 1 : 0,
})

export const date2str = (d: AltDate): string => `${d.year}-${d.month}-${d.day}`

export const semesterWeeks = {
  autumn: [
    { start: altDate(2024, 9, 9), end: altDate(2024, 10, 6) },
    { start: altDate(2024, 10, 7), end: altDate(2024, 11, 3) },
    { start: altDate(2024, 11, 4), end: altDate(2024, 12, 1) },
    { start: altDate(2024, 12, 2), end: altDate(2024, 12, 22) },
  ],
}

export const semesterMonths: SemesterMonths = {
  autumn: [mkMonth(9), mkMonth(10), mkMonth(11), mkMonth(12), mkMonth(1, true)],
  spring: [mkMonth(2), mkMonth(3), mkMonth(4), mkMonth(5), mkMonth(6), mkMonth(7)],
}

const _month2period: (Period | null)[] = [
  null, // ------- (0)
  "autumn", // 1
  //
  "spring", // 2
  "spring", // 3
  "spring", // 4
  "spring", // 5
  "spring", // 6
  "spring", // 7
  null,
  "autumn", // 9
  "autumn", // 10
  "autumn", // 11
  "autumn", // 12
]

export const _periodName = { autumn: "Q1", spring: "Q2" }

export const periodText = (year: number, period: Period) => {
  const y1 = year + (period === "spring" ? -1 : 0)
  const y2 = y1 + 1
  return `${y1}/${y2} - ${_periodName[period]}`
}

export const semesterForDate = (date: AltDate) => {
  const period = _month2period[date.month]
  if (period === null) {
    throw new Error(`Month ${date.month} does not have a Period!`)
  }
  const year = date.year + (date.month === 1 ? -1 : 0)
  return { year, period }
}

export const allDatesForSemester = (year: number, semester: Period) =>
  semesterMonths[semester].reduce<AltDate[]>((acc, m) => acc.concat(allDatesForMonth(year, m)), [])

const _allDatesForRange = (begin: Date, end: Date) => {
  const result: AltDate[] = []
  for (let x = begin; x < end; x = nextDay(x)) {
    result.push(date2altdate(x))
  }
  return result
}

export const allDatesForRange = (begin: AltDate, end: AltDate) =>
  _allDatesForRange(altdate2date(begin), altdate2date(end))

export const allDatesForMonth = (year: number, m: SemesterMonth) => {
  const next = nextMonth(m)
  let end = new Date(Date.UTC(year + next.yearDif, next.month - 1, 1))
  let begin = new Date(Date.UTC(year + m.yearDif, m.month - 1, 1))
  return _allDatesForRange(begin, end)
}

export const allDatesForMonthBetween = (
  year: number,
  m: SemesterMonth,
  limitLow: AltDate | undefined,
  limitHigh: AltDate | undefined
) => {
  const next = nextMonth(m)
  let begin = new Date(Date.UTC(year + m.yearDif, m.month - 1, 1))
  if (limitLow && begin < altdate2date(limitLow)) {
    begin = altdate2date(limitLow)
  }
  let end = new Date(Date.UTC(year + next.yearDif, next.month - 1, 1))
  if (limitHigh && end > altdate2date(limitHigh)) {
    end = altdate2date(limitHigh)
  }
  return _allDatesForRange(begin, end)
}

export type CalendarDate = {
  date: AltDate
  dow: number
  holiday: boolean
}
export const mergeWithHolidays = async (
  dates: AltDate[],
  specialDays: SpecialDay[]
): Promise<CalendarDate[]> => {
  const result = dates.map((date) => ({
    date,
    dow: altdate2date(date).getDay(),
    holiday: !!specialDays.find((d) => equalDates(d.date, date)),
  }))
  return result
}

export const groupIntoWeeks = (dates: AltDate[]) => {
  let week: MaybeAltDate[] = []
  const result: MaybeAltDate[][] = []
  for (const d of dates) {
    week.push(d)
    if (isSunday(d)) {
      result.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    result.push(week)
  }
  const firstWeek = result[0]
  if (firstWeek) {
    const padding: MaybeAltDate[] = Array.from({
      length: 7 - firstWeek.length,
    }).map((_) => null)
    firstWeek.splice(0, 0, ...padding)
  }
  const lastWeek = result[result.length - 1]
  if (lastWeek) {
    const { length } = lastWeek
    const padding: MaybeAltDate[] = Array.from({
      length: 7 - length,
    }).map(() => null)
    lastWeek.splice(length, 0, ...padding)
  }
  return result
}

export const mondayOfWeek = (dates: MaybeAltDate[]): AltDate => {
  if (dates.length === 0) {
    throw new Error(`Empty dates!`)
  }
  const first = dates.find((d) => d !== null)
  if (!first) {
    throw new Error(`No undefined dates!`)
  }
  const result = altdate2date(first)
  const dif = result.getDay()
  if (dif > 1) {
    result.setDate(result.getDate() - (dif - 1))
  } else if (dif < 1) {
    result.setDate(result.getDate() + 1)
  }
  return date2altdate(result)
}

export const weekDifference = (end: AltDate, start: AltDate): number => {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24
  const _end = altdate2date(end)
  const _start = altdate2date(start)
  const daysDiff = (_end.getTime() - _start.getTime()) / MILLIS_PER_DAY
  return Math.floor(daysDiff / 7)
}

export const slotsToIntervals = (selected: Set<string>, lab: boolean): Interval[] => {
  const result: Interval[] = []
  const list = [...selected.keys()]
  list.sort()

  let currInterval: Interval | undefined
  for (const sel of list) {
    const [sday, shour] = sel.split(" ")
    const hour: number = Number(shour)
    if (isContinuation(currInterval, asWeekDay(sday), hour)) {
      currInterval!.endHour = hour + 1
    } else {
      if (currInterval) {
        result.push(currInterval)
      }
      currInterval = {
        weekDay: asWeekDay(sday),
        startHour: hour,
        endHour: hour + 1,
        lab,
      }
    }
  }
  if (currInterval) {
    result.push(currInterval)
  }
  return result
}

export const groupSlots = (group: GroupWithSlots | undefined, lab: boolean) => {
  if (group === undefined) {
    return new Set<string>()
  }
  const { slots: groupSlots } = group
  const slots: Set<string> = new Set()
  for (const gslot of groupSlots) {
    for (let h = gslot.startHour; h < gslot.endHour; h++) {
      if (lab === undefined || gslot.lab === lab) {
        slots.add(hour2str(WEEK_DAYS[gslot.weekDay], String(h)))
      }
    }
  }
  return slots
}

export type SessionInfo = {
  group: GroupWithSlots
  date: AltDate
  holiday: boolean
  dow: number
  text: string
  shift?: number
}

type GroupSessionOptions = {
  includeNonClasses?: boolean
}

export const groupSessions = (
  classesBegin: AltDate | undefined,
  classesEnd: AltDate | undefined,
  calendarDates: CalendarDate[],
  group: GroupWithSlots,
  options: GroupSessionOptions = { includeNonClasses: true }
) => {
  const { slots } = group
  const weekdayMap = new Map<number, boolean>(slots.map((s) => [s.weekDay, s.lab]))

  const thereIsClass = (d: CalendarDate) => !d.holiday && isWithin(classesBegin, d.date, classesEnd)

  let currL = 1
  let currT = 1
  let sessions: SessionInfo[] = []
  for (const cdate of calendarDates) {
    const lab = weekdayMap.get(weekday(cdate.date))
    let info: SessionInfo = { group, ...cdate, text: "" }
    if (lab !== undefined && thereIsClass(cdate)) {
      if (lab) {
        info.text = `L${currL}`
        currL++
      } else {
        info.text = `T${currT}`
        currT++
      }
      if (currL > currT) {
        info.shift = currT - currL
      }
      sessions.push(info)
    } else {
      if (options && options.includeNonClasses) {
        sessions.push(info)
      }
    }
  }
  return sessions
}

import { altDate, altdate2date, date2altdate, Period, SpecialDayType } from "../dates"
import { db } from "./db"

const getSpecialDayOfType = (days: { date: Date; type: string }[], type: SpecialDayType) => {
  const result = days.find((d) => d.type === type)
  return result && date2altdate(result.date)
}

const firstMondayAfter = (year: number, month: number, day: number) => {
  let date = altdate2date(altDate(year, month, day))
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1)
    console.log(date)
  }
  return date2altdate(date)
}

const standarStartDate = (year: number, period: Period) => {
  switch (period) {
    case "autumn": {
      return firstMondayAfter(year, 9, 1)
    }
    case "spring": {
      return firstMondayAfter(year, 2, 1)
    }
  }
}

const toSemesterWithLimits = (smes: _SemesterWithLimits) => ({
  year: smes.year,
  period: smes.period,
  start:
    getSpecialDayOfType(smes.specialDays, "semester-start") ||
    standarStartDate(smes.year, smes.period as Period),
  end: getSpecialDayOfType(smes.specialDays, "semester-end"),
  classesEnd: getSpecialDayOfType(smes.specialDays, "classes-end"),
})

type _SemesterWithLimits = NonNullable<Awaited<ReturnType<typeof _dbSemesterGet>>>

const _dbSemesterGet = async (year: number, period: Period) =>
  db.semester.findUnique({
    where: { year_period: { year, period } },
    include: {
      specialDays: {
        where: {
          type: { in: ["semester-start", "semester-end", "classes-end"] },
        },
        select: { date: true, type: true },
      },
    },
  })

export type SemesterWithLimits = NonNullable<ReturnType<typeof toSemesterWithLimits>>

export async function dbSemesterGet(year: number, period: Period) {
  const result = await _dbSemesterGet(year, period)
  return result && toSemesterWithLimits(result)
}

export async function dbSemestersGet() {
  const semesters = await db.semester.findMany({
    include: {
      specialDays: {
        where: {
          type: { in: ["semester-start", "semester-end", "classes-end"] },
        },
        select: { date: true, type: true },
      },
    },
  })
  return semesters.map(toSemesterWithLimits)
}

export type DBSemester = Awaited<ReturnType<typeof dbSemestersGet>>[number]

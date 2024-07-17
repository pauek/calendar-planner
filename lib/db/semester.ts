import { date2altdate, Period, SpecialDayType } from "../dates"
import { db } from "./db"

const getSpecialDayOfType = (days: { date: Date; type: string }[], type: SpecialDayType) => {
  const result = days.find((d) => d.type === type)
  return result && date2altdate(result.date)
}

const toSemesterWithLimits = (smes: _SemesterWithLimits) => ({
  year: smes.year,
  semester: smes.period,
  start: getSpecialDayOfType(smes.specialDays, "semester-start"),
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

export async function dbSemesterGet(year: number, semester: Period) {
  const result = await _dbSemesterGet(year, semester)
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

import {
  AltDate,
  altdate2date,
  date2altdate,
  getSemester,
  Semester,
} from "@/lib/dates"
import { db } from "@/lib/db/db"
import { SEMESTER, YEAR } from "../config"

export const dbGetHolidaysForYear = async (
  year: number,
  semester: Semester
) => {
  const result = await db.specialDay.findMany({ where: { year, semester } })
  return result.map((d) => date2altdate(d.date))
}

export const dbGetHolidaysForMonth = async (
  year: number,
  semester: Semester,
  month: number
) => {
  return (await dbGetHolidaysForYear(year, semester)).filter(
    (d) => d.month === month
  )
}

export const dbAddHoliday = async (d: AltDate) => {
  await db.specialDay.create({
    data: {
      date: altdate2date(d),
      year: d.year,
      semester: getSemester(d),
    },
  })
}

export const dbToggleHoliday = async (d: AltDate) => {
  const date = altdate2date(d)
  const holiday = await db.specialDay.findUnique({
    where: { date },
  })
  const year_semester = { year: YEAR, semester: SEMESTER }
  if (holiday) {
    return await db.specialDay.delete({ where: { date } })
  }

  return await db.specialDay.create({
    data: {
      date,
      semester_: {
        connectOrCreate: {
          where: { year_semester },
          create: year_semester,
        },
      },
    },
  })
}

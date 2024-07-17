import {
  AltDate,
  altdate2date,
  date2altdate,
  semesterForDate,
  Period,
  SpecialDayType,
} from "@/lib/dates"
import { db } from "@/lib/db/db"

export const dbSpecialDaysGetForSemester = async (year: number, period: Period) => {
  const result = await db.specialDay.findMany({
    where: { year, period },
  })
  return result.map((d) => ({
    date: date2altdate(d.date),
    type: d.type as SpecialDayType,
  }))
}

export type SpecialDay = Awaited<ReturnType<typeof dbSpecialDaysGetForSemester>>[number]

export const dbSpecialDaysGetForMonth = async (year: number, period: Period, month: number) => {
  const specialDays = await dbSpecialDaysGetForSemester(year, period)
  return specialDays.filter((sd) => sd.date.month === month)
}

export const dbSpecialDayGet = async (d: AltDate, type: SpecialDayType) => {
  return await db.specialDay.findUnique({
    where: { date_type: { date: altdate2date(d), type } },
  })
}

export const dbSpecialDayAdd = async (d: AltDate, type: SpecialDayType) => {
  const year_period = semesterForDate(d)
  return await db.specialDay.create({
    data: {
      date: altdate2date(d),
      type,
      semester: {
        connectOrCreate: {
          where: { year_period },
          create: year_period,
        },
      },
    },
  })
}

export const dbSpecialDayDelete = async (d: AltDate, type: SpecialDayType) => {
  return await db.specialDay.delete({
    where: { date_type: { date: altdate2date(d), type } },
  })
}

export const dbSpecialDayToggle = async (d: AltDate, type: SpecialDayType) => {
  const existingDay = await dbSpecialDayGet(d, type)
  if (existingDay !== null) {
    return dbSpecialDayDelete(d, type)
  } else {
    return dbSpecialDayAdd(d, type)
  }
}

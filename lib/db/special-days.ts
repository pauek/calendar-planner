import {
  AltDate,
  altdate2date,
  date2altdate,
  semesterForDate,
  Period,
  SpecialDayType,
} from "@/lib/dates"
import { db } from "@/lib/db/db"

export const dbSpecialDaysGetForSemester = async (
  year: number,
  period: Period,
  courseId: number | null = null
) => {
  const result = await db.specialDay.findMany({
    where: { year, period, courseId },
  })
  return result.map((d) => ({
    date: date2altdate(d.date),
    type: d.type as SpecialDayType,
  }))
}

export type SpecialDay = Awaited<ReturnType<typeof dbSpecialDaysGetForSemester>>[number]

export const dbSpecialDaysGetForMonth = async (
  year: number,
  period: Period,
  month: number,
  courseId?: number
) => {
  const specialDays = await dbSpecialDaysGetForSemester(year, period, courseId)
  return specialDays.filter((sd) => sd.date.month === month)
}

export const dbSpecialDayGet = async (d: AltDate, type: SpecialDayType, courseId: number | null = null) => {
  return await db.specialDay.findFirst({
    where: { date: altdate2date(d), type, courseId },
  })
}

export const dbSpecialDayGetAllOfType = async (type: SpecialDayType, courseId: number | null = null) => {
  return await db.specialDay.findMany({ where: { type, courseId } })
}

export const dbSpecialDayAdd = async (d: AltDate, type: SpecialDayType, courseId: number | null = null) => {
  const year_period = semesterForDate(d)
  let courseConnect = {}
  if (courseId) {
    courseConnect = {
      course: {
        connect: { id: courseId },
      },
    }
  }
  return await db.specialDay.create({
    data: {
      date: altdate2date(d),
      type,
      ...courseConnect,
      semester: {
        connectOrCreate: {
          where: { year_period },
          create: year_period,
        },
      },
    },
  })
}

export const dbSpecialDayUpdate = async (d: AltDate, type: SpecialDayType, courseId: number) => {
  const date = altdate2date(d)
  return await db.specialDay.update({
    where: { date_type_courseId: { date, type, courseId } },
    data: { date, type, courseId },
  })
}

export const dbSpecialDayDelete = async (d: AltDate, type: SpecialDayType, courseId: number | null = null) => {
  return await db.specialDay.deleteMany({
    where: { date: altdate2date(d), type, courseId },
  })
}

export const dbSpecialDayDeleteAll = async (type: SpecialDayType, courseId: number | null = null) => {
  return await db.specialDay.deleteMany({
    where: { type, courseId },
  })
}

export const dbSpecialDayToggle = async (d: AltDate, type: SpecialDayType, courseId: number | null = null) => {
  const existingDay = await dbSpecialDayGet(d, type, courseId)
  if (existingDay !== null) {
    return dbSpecialDayDelete(d, type, courseId)
  } else {
    return dbSpecialDayAdd(d, type, courseId)
  }
}

/* This is for "partial-exam" and "final-exam" so the type of day is unique... for now */
export const dbSpecialDaySet = async (d: AltDate, type: SpecialDayType, courseId: number) => {
  // Erase specialDays with the same type (there shoud be only one, in fact)
  await db.specialDay.deleteMany({
    where: { type, courseId },
  })
  // Now add it again
  return dbSpecialDayAdd(d, type, courseId)
}

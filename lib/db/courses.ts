import { Interval, Period, weekDay2index } from "@/lib/dates"
import { db } from "@/lib/db/db"

export async function dbGroupAdd(courseId: number, group: string) {
  return await db.course.update({
    where: { id: courseId },
    data: {
      groups: { create: { group } },
    },
  })
}

export async function dbCourseGetByName(year: number, period: Period, name: string) {
  return await db.course.findUnique({
    where: { name_year_period: { name, year, period } },
    include: {
      groups: {
        include: {
          slots: {
            select: {
              weekDay: true,
              startHour: true,
              endHour: true,
              lab: true,
            },
          },
        },
      },
    },
  })
}

export async function dbCourseGetById(courseId: number) {
  return await db.course.findUnique({
    where: { id: courseId },
    include: {
      groups: {
        include: {
          slots: {
            select: {
              weekDay: true,
              startHour: true,
              endHour: true,
              lab: true,
            },
          },
        },
      },
    },
  })
}

export async function dbCoursesGetAllForSemester(year: number, period: Period) {
  return await db.course.findMany({
    where: { year, period },
  })
}

export async function dbCourseGetOrThrow(courseId: number) {
  const course = await dbCourseGetById(courseId)
  if (course === null) {
    throw new Error(`Course with ID ${courseId} not found!`)
  }
  return course
}

export type CourseWithGroups = Awaited<ReturnType<typeof dbCourseGetById>>
export type GroupWithSlots = NonNullable<CourseWithGroups>["groups"][number]

export async function dbGroupDeleteIntervals(groupId: number, lab: boolean) {
  await db.group.update({
    where: { id: groupId },
    data: { slots: { deleteMany: { lab } } },
  })
}

export async function dbGroupSetIntervals(groupId: number, intervals: Interval[]) {
  await db.group.update({
    where: { id: groupId },
    data: {
      slots: {
        createMany: {
          data: intervals.map((ival) => ({
            weekDay: weekDay2index(ival.weekDay),
            startHour: ival.startHour,
            endHour: ival.endHour,
            lab: ival.lab,
          })),
        },
      },
    },
  })
}

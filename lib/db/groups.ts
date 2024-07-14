import { Interval, Semester, weekDay2index } from "@/lib/dates";
import { db } from "@/lib/db/db";

export async function dbAddGroup(
  year: number,
  semester: Semester,
  group: string,
  intervals: Interval[]
) {
  const year_semester = { year, semester };
  await db.group.create({
    data: {
      group,
      semester_: {
        connectOrCreate: {
          where: { year_semester },
          create: year_semester,
        },
      },
      slots: {
        createMany: {
          data: intervals.map((ival) => ({
            weekDay: weekDay2index(ival.weekDay),
            startHour: ival.startHour,
            endHour: ival.endHour,
            lab: false,
          })),
        },
      },
    },
  });
}

export async function dbGetGroups(year: number, semester: Semester) {
  return await db.group.findMany({
    where: { year, semester },
    include: {
      slots: {
        select: { weekDay: true, startHour: true, endHour: true, lab: true },
      },
    },
  });
}

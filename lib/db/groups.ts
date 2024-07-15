import { Interval, Semester, weekDay2index } from "@/lib/dates";
import { db } from "@/lib/db/db";

export async function dbGroupAdd(year: number, semester: Semester, group: string) {
  const year_semester = { year, semester };
  return await db.group.create({
    data: {
      group,
      semester_: {
        connectOrCreate: {
          where: { year_semester },
          create: year_semester,
        },
      },
    },
  });
}

export async function dbGroupGetAllWithSlots(year: number, semester: Semester) {
  return await db.group.findMany({
    where: { year, semester },
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
  });
}

export type GroupWithSlots = Awaited<ReturnType<typeof dbGroupGetAllWithSlots>>[number];

export async function dbGroupDeleteIntervals(groupId: number, lab: boolean) {
  await db.group.update({
    where: { id: groupId },
    data: { slots: { deleteMany: { lab } } },
  });
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
  });
}

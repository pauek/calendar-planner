import { getSemester, Semester } from "@/lib/dates";
import { db } from "@/lib/db/db";

export const dbGetHolidaysForYear = async (year: number, semester: Semester) => {
  return await db.holiday.findMany({ where: { year, semester } });
};

export const dbGetHolidaysForMonth = async (
  year: number,
  semester: Semester,
  month: number
) => {
  const result = await db.holiday.findMany({
    where: {
      year,
      semester,
      date: {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lte: new Date(Date.UTC(year, month, 1)),
      },
    },
  });
  // console.log(result.map(d => d.date));
  return result.map(d => d.date);
};

export const dbAddHoliday = async (date: Date) => {
  await db.holiday.create({
    data: {
      date,
      semester: getSemester(date),
      year: date.getFullYear(),
    },
  });
};

export const dbToggleHoliday = async (date: Date) => {
  const holiday = await db.holiday.findUnique({ where: { date } });
  const year_semester = {
    year: date.getFullYear(),
    semester: getSemester(date),
  };
  if (holiday) {
    await db.holiday.delete({ where: { date } });
  } else {
    await db.holiday.create({
      data: {
        date,
        semester_: {
          connectOrCreate: {
            where: { year_semester },
            create: year_semester,
          },
        },
      },
    });
  }
};

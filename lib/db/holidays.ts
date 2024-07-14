import { dateonly, DateOnly, dateOnly2date, getSemester, Semester } from "@/lib/dates";
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
        lt: new Date(Date.UTC(year, month, 1)),
      },
    },
  });
  return result.map((d) => dateonly(d.date));
};

export const dbAddHoliday = async (d: DateOnly) => {
  await db.holiday.create({
    data: {
      date: dateOnly2date(d),
      year: d.year,
      semester: getSemester(d),
    },
  });
};

export const dbToggleHoliday = async (d: DateOnly) => {
  const date = dateOnly2date(d);
  const holiday = await db.holiday.findUnique({
    where: { date },
  });
  const year_semester = {
    year: d.year,
    semester: getSemester(d),
  };
  if (holiday) {
    return await db.holiday.delete({ where: { date } });
  }

  return await db.holiday.create({
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
};

"use server";

import { Interval, Semester } from "@/lib/dates";
import { dbAddGroup } from "@/lib/db/groups";
import { revalidatePath } from "next/cache";

export async function actionAddGroup(
  year: number,
  semester: Semester,
  group: string,
  intervals: Interval[]
) {
  await dbAddGroup(year, semester, group, intervals);
  revalidatePath("/timetable");
}

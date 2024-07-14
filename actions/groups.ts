"use server";

import { Interval, Semester } from "@/lib/dates";
import { dbGroupAdd, dbGroupSetIntervals } from "@/lib/db/groups";
import { revalidatePath } from "next/cache";

export async function actionGroupAdd(year: number, semester: Semester, group: string) {
  await dbGroupAdd(year, semester, group);
  revalidatePath("/timetable");
}

export async function actionGroupSetIntervals(groupId: number, intervals: Interval[]) {
  await dbGroupSetIntervals(groupId, intervals);
  revalidatePath("/timetable");
}

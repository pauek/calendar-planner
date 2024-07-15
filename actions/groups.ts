"use server";

import { Interval, Semester } from "@/lib/dates";
import { dbGroupAdd, dbGroupDeleteIntervals, dbGroupSetIntervals } from "@/lib/db/groups";
import { revalidatePath } from "next/cache";

export async function actionGroupAdd(year: number, semester: Semester, group: string) {
  await dbGroupAdd(year, semester, group);
  revalidatePath("/timetable");
}

export async function actionGroupSetIntervals(groupId: number, lab: boolean, intervals: Interval[]) {
  await dbGroupDeleteIntervals(groupId, lab);
  if (intervals.some(ival => ival.lab !== lab)) {
    throw new Error(`Some intervals don't match 'lab'!!`);
  }
  await dbGroupSetIntervals(groupId, intervals);
  revalidatePath("/timetable");
}

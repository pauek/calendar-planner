"use server";

import { Interval, Period } from "@/lib/dates";
import { dbGroupAdd, dbGroupDeleteIntervals, dbGroupSetIntervals } from "@/lib/db/courses";
import { revalidatePath } from "next/cache";

export async function actionGroupAdd(courseId: number, group: string) {
  await dbGroupAdd(courseId, group);
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

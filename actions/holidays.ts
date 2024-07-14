"use server"

import { DateOnly } from "@/lib/dates";
import { dbToggleHoliday } from "@/lib/db/holidays"
import { revalidatePath } from "next/cache";

export async function actionToggleHoliday(d: DateOnly) {
  const result = await dbToggleHoliday(d);
  console.log("result", result);
  revalidatePath("/holidays");
}
"use server"

import { dbToggleHoliday } from "@/lib/db/holidays"
import { revalidatePath } from "next/cache";

export async function actionToggleHoliday(date: Date) {
  await dbToggleHoliday(date);
  console.log("actionToggleHoliday", date);
  revalidatePath("/holidays");
}
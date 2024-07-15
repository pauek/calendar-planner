"use server"

import { AltDate } from "@/lib/dates";
import { dbToggleHoliday } from "@/lib/db/special-days"
import { revalidatePath } from "next/cache";

export async function actionToggleHoliday(d: AltDate) {
  await dbToggleHoliday(d);
  revalidatePath("/holidays");
}
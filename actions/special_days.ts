"use server"

import { AltDate } from "@/lib/dates"
import { dbSpecialDayToggle } from "@/lib/db/special-days"
import { revalidatePath } from "next/cache"

export async function actionToggleHoliday(d: AltDate) {
  await dbSpecialDayToggle(d, "no-class")
  revalidatePath("/holidays")
}

"use server"

import { AltDate, SpecialDayType } from "@/lib/dates"
import { dbSpecialDayToggle } from "@/lib/db/special-days"
import { revalidatePath } from "next/cache"

export async function actionToggleSpecialDay(d: AltDate, type: SpecialDayType) {
  await dbSpecialDayToggle(d, type)
  revalidatePath("/holidays")
}

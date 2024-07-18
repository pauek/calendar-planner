"use server"

import { AltDate, getPeriod, SpecialDayType } from "@/lib/dates"
import { dbCourseGetById } from "@/lib/db/courses"
import { dbSpecialDaySet, dbSpecialDayToggle } from "@/lib/db/special-days"
import { revalidatePath } from "next/cache"

export async function actionToggleSpecialDay(d: AltDate, type: SpecialDayType) {
  await dbSpecialDayToggle(d, type)
  revalidatePath(`/${d.year}/${getPeriod(d)}`)
}

export async function actionSpecialDaySetForCourse(courseId: number, d: AltDate, type: SpecialDayType) {
  console.log("actionSpecialDaySetForCourse", courseId, d, type)
  await dbSpecialDaySet(d, type, courseId)
  const course = await dbCourseGetById(courseId);
  const path = `/${d.year}/${getPeriod(d)}/${course!.name}`
  console.log(path)
  revalidatePath(path)
}

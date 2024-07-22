"use server"

import { AltDate, getPeriod, SpecialDayType } from "@/lib/dates"
import { dbCourseGetOrThrow } from "@/lib/db/courses"
import { dbSpecialDayDeleteAll, dbSpecialDaySet, dbSpecialDayToggle } from "@/lib/db/special-days"
import { revalidatePath } from "next/cache"

export async function actionToggleSpecialDay(d: AltDate, type: SpecialDayType) {
  await dbSpecialDayToggle(d, type)
  revalidatePath(`/${d.year}/${getPeriod(d)}`)
}

const revalidateCoursePath = async (courseId: number) => {
  const course = await dbCourseGetOrThrow(courseId);
  const path = `/${course.year}/${course.period}/${course.name}`;
  revalidatePath(path)
  console.log("revalidated", path)

}

export async function actionSpecialDaySetForCourse(courseId: number, d: AltDate, type: SpecialDayType) {
  console.log("set day ", courseId, d, type)
  await dbSpecialDaySet(d, type, courseId)
  revalidateCoursePath(courseId);
}

export async function actionSpecialDayRemoveForCourse(courseId: number, type: SpecialDayType) {
  console.log("remove day", courseId, type)
  await dbSpecialDayDeleteAll(type, courseId);
  revalidateCoursePath(courseId);
}
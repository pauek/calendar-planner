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
}

export async function actionSpecialDaySetForCourse(courseId: number, d: AltDate, type: SpecialDayType) {
  await dbSpecialDaySet(d, type, courseId)
  revalidateCoursePath(courseId);
}

export async function actionSpecialDayRemoveForCourse(courseId: number, type: SpecialDayType) {
  await dbSpecialDayDeleteAll(type, courseId);
  revalidateCoursePath(courseId);
}
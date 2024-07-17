"use server"

import { Period } from "@/lib/dates"
import { dbCourseGetById, dbCoursesGetAllForSemester } from "@/lib/db/courses"

export async function actionGetAllCourses(year: number, semester: Period) {
  return await dbCoursesGetAllForSemester(year, semester)
}

export async function actionGetCourseById(courseId: number) {
  return await dbCourseGetById(courseId)
}

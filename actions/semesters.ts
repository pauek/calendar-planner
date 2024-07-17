"use server"

import { Period } from "@/lib/dates"
import { dbSemesterGet } from "@/lib/db/semester"

export async function actionSemesterGet(year: number, semester: string) {
  return await dbSemesterGet(year, semester as Period)
}

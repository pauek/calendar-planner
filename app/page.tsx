"use client"

import { date2altdate, semesterForDate } from "@/lib/dates"
import { redirect } from "next/navigation"

export default function Home() {
  const now = new Date()
  const date = date2altdate(now)
  const { year, period } = semesterForDate(date)
  redirect(`/${year}/${period}`)
}

"use client"

import { useCourse } from "@/components/CourseProvider"
import { redirect } from "next/navigation"

export default function Home() {
  const { course, semester } = useCourse()
  if (course && semester) {
    redirect(`/courses/${course.id}`)
  } else {
    return <main>Choose a semester and a course...</main>
  }
}

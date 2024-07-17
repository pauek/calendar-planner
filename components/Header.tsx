"use client"

import { DBSemester } from "@/lib/db/semester"
import Link from "next/link"
import { useCourse } from "./CourseProvider"
import SemesterCourseSelector from "./SemesterCourseSelector"

type HeaderProps = {
  semesters: DBSemester[]
}
export default function Header({ semesters }: HeaderProps) {
  const { course } = useCourse()
  return (
    <header className="h-12 shadow px-4 flex flex-row gap-4 items-center">
      <Link href="/" className="font-bold text-xl">
        CalendarPlanner
      </Link>
      <div className="w-4"></div>
      <SemesterCourseSelector semesters={semesters} />
      {course && <Link href={`/courses/${course.id}/edit`}>Configura</Link>}
    </header>
  )
}

"use client"

import { actionGetAllCourses } from "@/actions/courses"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Period } from "@/lib/dates"
import { DBSemester } from "@/lib/db/semester"
import { titleize } from "@/lib/utils"
import { Course } from "@prisma/client"
import { useEffect, useState } from "react"
import { useCourse } from "./CourseProvider"

type SelectorSemesterProps = {
  semesters: DBSemester[]
}
export default function SemesterCourseSelector({ semesters }: SelectorSemesterProps) {
  const [indexStr, setIndexStr] = useState<string>("")
  const [courses, setCourses] = useState<Course[] | null>(null)
  const [course, setCourse] = useState<string>("")

  const { setCourseId } = useCourse()

  useEffect(() => {
    setCourses(null)
    setCourse("")
    const { year, semester: sem } = semesters[Number(indexStr)]
    actionGetAllCourses(year, sem as Period).then(setCourses)
  }, [indexStr, semesters])

  const selectCourse = (val: string) => {
    if (setCourseId) {
      setCourseId(Number(val))
    }
  }

  return (
    <>
      <Select onValueChange={setIndexStr}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Semester" />
        </SelectTrigger>
        <SelectContent>
          {semesters.map(({ year, semester }, i) => (
            <SelectItem key={i} value={`${i}`}>
              {year} {titleize(semester)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={selectCourse} disabled={courses === null || courses.length === 0}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Course" />
        </SelectTrigger>
        <SelectContent>
          {courses?.map((course) => (
            <SelectItem key={course.id} value={`${course.id}`}>
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {course}
    </>
  )
}

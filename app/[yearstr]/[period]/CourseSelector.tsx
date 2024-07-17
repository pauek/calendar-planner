"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Course } from "@prisma/client"
import { redirect, usePathname } from "next/navigation"

type SelectorSemesterProps = {
  courses: Course[]
}
export default function SemesterCourseSelector({ courses }: SelectorSemesterProps) {
  const path = usePathname()
  
  return (
    <Select onValueChange={redirect} defaultValue={path}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semester" />
      </SelectTrigger>
      <SelectContent>
        {courses.map((course, i) => (
          <SelectItem key={i} value={`/${course.year}/${course.period}/${course.name}`}>
            {course?.name || "No Name???"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

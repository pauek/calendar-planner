"use client"

import { actionGetCourseById } from "@/actions/courses"
import { actionSemesterGet } from "@/actions/semesters"
import { CourseWithGroups } from "@/lib/db/courses"
import { SemesterWithLimits } from "@/lib/db/semester"
import { getCourseIdFromPathname } from "@/lib/utils"
import { usePathname } from "next/navigation"
import React, { createContext, useContext, useEffect, useState } from "react"

type ContextValue = {
  course: CourseWithGroups | null
  semester: SemesterWithLimits | null
  setCourseId: null | ((courseId: number) => void)
}

const CourseContext = createContext<ContextValue>({
  course: null,
  semester: null,
  setCourseId: null,
})

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const cid = getCourseIdFromPathname(pathname)

  const [courseId, setCourseId] = useState<number | null>(cid)
  const [course, setCourse] = useState<CourseWithGroups | null>(null)
  const [semester, setSemester] = useState<SemesterWithLimits | null>(null)

  useEffect(() => {
    if (courseId !== null) {
      actionGetCourseById(courseId).then(setCourse)
    }
  }, [courseId])

  useEffect(() => {
    if (course) {
      actionSemesterGet(course.year, course.semester).then(setSemester)
    }
  }, [course])

  return (
    <CourseContext.Provider value={{ course, semester, setCourseId }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  return context
}

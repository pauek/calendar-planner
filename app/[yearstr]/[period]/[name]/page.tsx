import { Period } from "@/lib/dates"
import { dbCourseGetByName } from "@/lib/db/courses"
import { dbSemesterGet } from "@/lib/db/semester"
import { notFound } from "next/navigation"
import CourseCalendar from "./CourseCalendar"

type PageProps = {
  params: {
    yearstr: string
    period: Period
    name: string
  }
}
export default async function Home({ params }: PageProps) {
  const { yearstr, period, name } = params
  const year = Number(yearstr)

  const course = await dbCourseGetByName(year, period, name)
  if (course === null) {
    notFound()
  }

  const semester = await dbSemesterGet(course.year, period)
  if (semester === null) {
    throw new Error(`Expected to find semester for course ${name}`)
  }

  return (
    <main className="flex-1 flex flex-col p-6 items-stretch">
      <h1>{course.name}</h1>
      <CourseCalendar name={name} year={year} period={period} />
    </main>
  )
}

import SpecialDaysEditor from "@/components/SpecialDaysEditor"
import SlotsEditor from "@/components/SlotsEditor"
import { dbCourseGetById, dbCourseGetByName } from "@/lib/db/courses"
import { dbSemesterGet } from "@/lib/db/semester"
import { notFound } from "next/navigation"
import { Period } from "@/lib/dates"

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
    <main className="p-6 flex flex-row">
      <SpecialDaysEditor semester={semester} />
      <div className="w-12"></div>
      <SlotsEditor course={course} />
    </main>
  )
}

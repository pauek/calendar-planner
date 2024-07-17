import { Period } from "@/lib/dates"
import { dbCoursesGetAllForSemester } from "@/lib/db/courses"
import CourseSelector from "./CourseSelector"

type PageProps = {
  params: {
    yearstr: string
    period: string
  }
  children: React.ReactNode
}
export default async function Layout({ params, children }: PageProps) {
  const { yearstr, period: p } = params
  const year = Number(yearstr)
  const period = p as Period

  const courses = await dbCoursesGetAllForSemester(year, period)

  return (
    <main className="p-8">
      <CourseSelector courses={courses} />
      {children}
    </main>
  )
}

import SpecialDaysEditor from "@/components/SpecialDaysEditor"
import { Period } from "@/lib/dates"
import { dbCoursesGetAllForSemester } from "@/lib/db/courses"
import { dbSemesterGet } from "@/lib/db/semester"

type PageProps = {
  params: {
    yearstr: string
    period: Period
  }
}
export default async function Page({ params }: PageProps) {
  const { yearstr, period } = params
  const year = Number(yearstr)

  const semester = await dbSemesterGet(year, period)
  if (semester === null) {
    throw new Error(`Expected to find semester for course ${name}`)
  }

  return (
    <>
      <SpecialDaysEditor semester={semester} />
    </>
  )
}

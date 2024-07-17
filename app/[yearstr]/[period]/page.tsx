import SpecialDaysEditor from "@/components/SpecialDaysEditor"
import { Period } from "@/lib/dates"
import { dbSemesterGet } from "@/lib/db/semester"
import { dbSpecialDaysGetForSemester } from "@/lib/db/special-days"

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

  const specialDays = await dbSpecialDaysGetForSemester(year, semester.period as Period)

  return (
    <>
      <SpecialDaysEditor semester={semester} specialDays={specialDays} />
    </>
  )
}

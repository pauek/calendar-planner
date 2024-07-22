import { Period, periodText } from "@/lib/dates"
import { dbCoursesGetAllForSemester } from "@/lib/db/courses"
import MenuLink from "./MenuLink"

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
    <div className="flex-1 flex flex-row gap-2 items-stretch">
      <div className="border-r pt-2">
        <MenuLink href={`/${year}/${period}`}>
          <h2 className="pl-4 pr-6 mb-0 font-light">{periodText(year, period)}</h2>
        </MenuLink>
        {courses.map((course) => (
          <MenuLink key={course.id} href={`/${year}/${period}/${course.name}`} className="pl-8 pr-6">
            {course.name}
          </MenuLink>
        ))}
      </div>
      {children}
    </div>
  )
}

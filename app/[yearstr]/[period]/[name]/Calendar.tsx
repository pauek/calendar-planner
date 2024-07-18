import MonthName from "@/components/MonthName"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as dates from "@/lib/dates"
import { dbCourseGetByName, dbCourseGetExams, Exams, GroupWithSlots } from "@/lib/db/courses"
import { dbSemesterGet } from "@/lib/db/semester"
import { dbSpecialDayAdd, dbSpecialDaysGetForSemester, SpecialDay } from "@/lib/db/special-days"
import { transpose } from "@/lib/utils"
import DayTable from "./DayTable"
import Session from "./Session"
import TableCell from "./TableCell"
import SlotsEditor from "@/components/SlotsEditor"
import { CalendarDate } from "@/lib/dates"

type CalendarProps = {
  name?: string
  year: number
  period: dates.Period
}
export default async function Calendar({ name, year, period }: CalendarProps) {
  const dbSemester = await dbSemesterGet(year, period)
  if (!dbSemester) {
    throw new Error(`Expected dbSemester to be !== null`)
  }

  const allDates = dates.allDatesForSemester(year, period)

  let course = undefined
  let groups: GroupWithSlots[] = []
  let exams: Exams = {}
  let allGroupsSessions: dates.SessionInfo[][] = []
  let onlyClassSessions: dates.SessionInfo[][] = []
  let courseSpecialDays: SpecialDay[] = []
  let cdates: CalendarDate[] = []

  const semesterSpecialDays = await dbSpecialDaysGetForSemester(year, period)

  if (name) {
    course = await dbCourseGetByName(year, period as dates.Period, name)
    if (course) {
      courseSpecialDays = await dbSpecialDaysGetForSemester(year, period, course.id)
      groups = course.groups
      exams = await dbCourseGetExams(course.id)
      console.log(exams)
    }
  }

  cdates = await dates.mergeWithHolidays(allDates, [...semesterSpecialDays, ...courseSpecialDays])

  allGroupsSessions = groups.map((group) =>
    dates.groupSessions(dbSemester.start, dbSemester.classesEnd, cdates, group)
  )

  onlyClassSessions = groups.map((group) =>
    dates.groupSessions(dbSemester.start, dbSemester.classesEnd, cdates, group, {
      includeNonClasses: false,
    })
  )

  return (
    <main className="flex-1 flex flex-col gap-4 items-start select-none">
      <Tabs defaultValue="groups">
        <TabsList>
          {course && <TabsTrigger value="groups">Grups</TabsTrigger>}
          <TabsTrigger value="setmanes">Setmanes</TabsTrigger>
          <TabsTrigger value="mesos">Mesos</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          {course ? <SlotsEditor course={course} exams={exams} /> : <div>Selecciona un curs</div>}
        </TabsContent>

        <TabsContent value="setmanes">
          {dates.semesterWeeks.autumn.map((week, i) => (
            <div key={i} className="mt-8">
              <DayTable
                weekTitles={true}
                dbSemester={dbSemester}
                groups={groups}
                cdates={cdates.filter((d) => dates.isWithin(week.start, d.date, week.end))}
                sessions={allGroupsSessions.map((sessions) =>
                  sessions.filter((s) => dates.isWithin(week.start, s.date, week.end))
                )}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="mesos">
          <div className="mt-6">
            {dates.semesterMonths[period].map((month, i) => (
              <div key={i} className="mb-2">
                <MonthName className="pl-[1.7rem]" month={month} />
                <DayTable
                  weekTitles={false}
                  dbSemester={dbSemester}
                  groups={groups}
                  cdates={cdates.filter((d) => dates.dateInMonth(d.date, year, month))}
                  sessions={allGroupsSessions.map((sessions) =>
                    sessions.filter((s) => dates.dateInMonth(s.date, year, month))
                  )}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <table>
            <thead>
              <tr>
                {groups.map((group, i) => (
                  <th key={i}>{group.group}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transpose(onlyClassSessions).map((sessions, i) => (
                <tr key={i}>
                  {sessions.map((session, j) => (
                    <TableCell
                      key={j}
                      dbSemester={dbSemester}
                      cdate={session}
                      header={false}
                      className="w-[3rem] h-[1.8rem]"
                    >
                      <Session session={session} className="text-base" />
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </main>
  )
}

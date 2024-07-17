import MonthName from "@/components/MonthName"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as dates from "@/lib/dates"
import { dbCourseGetByName, GroupWithSlots } from "@/lib/db/courses"
import { dbSemesterGet } from "@/lib/db/semester"
import { dbSpecialDaysGetForSemester as dbGetSpecialDaysForYear } from "@/lib/db/special-days"
import { transpose } from "@/lib/utils"
import DayTable from "./DayTable"
import Session from "./Session"
import TableCell from "./TableCell"
import SlotsEditor from "@/components/SlotsEditor"

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

  const specialDays = await dbGetSpecialDaysForYear(year, period)
  const allDates = dates.allDatesForSemester(year, period)
  const cdates = await dates.mergeWithHolidays(allDates, specialDays)

  let course = undefined
  let groups: GroupWithSlots[] = []
  let allGroupsSessions: dates.SessionInfo[][] = []
  let onlyClassSessions: dates.SessionInfo[][] = []

  if (name) {
    course = await dbCourseGetByName(year, period as dates.Period, name)
    if (course === null) {
      throw new Error(`Course ${name} not found!!`)
    }

    groups = course.groups

    allGroupsSessions = groups.map((group) =>
      dates.groupSessions(dbSemester.start, dbSemester.classesEnd, cdates, group)
    )

    onlyClassSessions = groups.map((group) =>
      dates.groupSessions(dbSemester.start, dbSemester.classesEnd, cdates, group, {
        includeNonClasses: false,
      })
    )
  }

  return (
    <main className="p-6 w-fit flex flex-col gap-4 items-start select-none">
      <Tabs defaultValue={course ? "groups" : "setmanes"} className="w-[400px]">
        <TabsList>
          {course && <TabsTrigger value="groups">Grups</TabsTrigger>}
          <TabsTrigger value="setmanes">Setmanes</TabsTrigger>
          <TabsTrigger value="mesos">Mesos</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          {course ? <SlotsEditor course={course} /> : <div>Selecciona un curs</div>}
        </TabsContent>

        <TabsContent value="setmanes">
          {dates.semesterWeeks.autumn.map((week, i) => (
            <div key={i} className="mt-8">
              <DayTable
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

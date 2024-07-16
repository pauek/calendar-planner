import MonthName from "@/components/MonthName"
import * as config from "@/lib/config"
import type { CalendarDate } from "@/lib/dates"
import * as dates from "@/lib/dates"
import { dbGroupGetAllWithSlots } from "@/lib/db/groups"
import { dbGetHolidaysForYear } from "@/lib/db/special-days"
import { cn, makeArray, transpose } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Home() {
  const holidays = await dbGetHolidaysForYear(config.YEAR, config.SEMESTER)
  const allDates = dates.allDatesForSemester(config.YEAR, config.SEMESTER)
  const cdates = await dates.mergeWithHolidays(allDates, holidays)
  const groups = await dbGroupGetAllWithSlots(config.YEAR, config.SEMESTER)
  const allGroupsSessions = groups.map((group) => dates.groupSessions(cdates, group))

  const onlyClassSessions = groups.map((group) =>
    dates.groupSessions(cdates, group, { includeNonClasses: false })
  )

  return (
    <div className="p-6 w-fit flex flex-col gap-4 items-start select-none">
      <Tabs defaultValue="setmanes" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="setmanes">Setmanes</TabsTrigger>
          <TabsTrigger value="mesos">Mesos</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="setmanes">
          {dates.semesterWeeks.autumn.map((week, i) => (
            <div key={i} className="mt-8">
              <DayTable
                firstWeekStart={dates.semesterWeeks.autumn[0].start}
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
            {dates.semesterMonths.autumn.map((month, i) => (
              <div key={i} className="mb-2">
                <MonthName className="pl-[1.7rem]" month={month} />
                <DayTable
                  groups={groups}
                  cdates={cdates.filter((d) => dates.dateInMonth(d.date, config.YEAR, month))}
                  sessions={allGroupsSessions.map((sessions) =>
                    sessions.filter((s) => dates.dateInMonth(s.date, config.YEAR, month))
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
    </div>
  )
}

type DayTableProps = {
  firstWeekStart?: dates.AltDate
  sessions: dates.SessionInfo[][]
  cdates: CalendarDate[]
  groups: dates.GroupData[]
}
const DayTable = async ({ firstWeekStart, sessions, cdates, groups }: DayTableProps) => {
  return (
    <table className="border-collapse select-none">
      <tbody>
        <tr>
          <td className="w-8"></td>
          {cdates.map((cdate, i) => (
            <TableCell key={i} className="relative" cdate={cdate} header={true}>
              {firstWeekStart && cdate.dow === 1 && (
                <div className="absolute -top-[1.1rem] -left-[.3em] w-8 text-center text-xs text-gray-500 overflow-visible text-nowrap font-semibold border-black pl-1">
                  SETMANA {1 + dates.weekDifference(cdate.date, firstWeekStart)}
                </div>
              )}
              <div className={cn("w-8 text-center")}>{cdate.date.day}</div>
            </TableCell>
          ))}
        </tr>
        {groups.map((group, ig) => (
          <tr key={group.id}>
            <td className="text-right pr-2 w-8 text-sm text-stone-400">{group.group}</td>
            {sessions[ig].map((session, id) => (
              <TableCell key={id} cdate={session} header={false}>
                <Session session={sessions[ig][id]} />
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type SessionProps = {
  session: dates.SessionInfo
  className?: string
}
const Session = ({ session, className }: SessionProps) => {
  if (session === undefined) {
    return <div></div>
  } else {
    let shift = session.shift ? -session.shift : 0

    let bg = ""
    if (shift == 1) {
      bg = "bg-red-100"
    } else if (shift == 2) {
      bg = "bg-red-200"
    }

    return (
      <div
        className={cn(
          "text-center h-[1.8em] text-[0.8rem]",
          "flex flex-col justify-center relative",
          bg,
          className
        )}
      >
        {session.text}
        {false && (
          <div
            className={cn(
              "absolute left-0 bottom-0 right-0 h-[0.35rem]",
              "flex flex-row justify-center items-stretch gap-0.5"
            )}
          >
            {makeArray({ length: shift }).map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-red-500"></div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

type TableCellProps = {
  cdate: CalendarDate
  children: React.ReactNode
  header: boolean
  className?: string
}
const TableCell = ({ cdate, children, header, className }: TableCellProps) => {
  const common = "p-0 h-[1px]"

  if (cdate === undefined) {
    return <td></td>
  }

  if (!dates.isWithin(config.SEMESTER_BEGIN, cdate.date, config.SEMESTER_END)) {
    const tomorrow = dates.isTomorrow(cdate.date, config.SEMESTER_BEGIN)

    let br = ""
    if (tomorrow) {
      br = "border-r"
      if (dates.isWeekend(cdate.date)) {
        br = "border-r-2 border-r-black"
      }
    }

    return <td className={cn(common, "border border-transparent", br, className)}>
      <div className="w-8"></div>
    </td>
  } else {
    let b = "border"
    let bcolor = header ? "border-black" : "border-gray-400"
    let sunday = cdate.dow === 0
    if (sunday) {
      b = "border border-r-2"
      bcolor = `${bcolor} border-r-black`
    }

    let bg = ""
    if (dates.isWeekend(cdate.date)) {
      bg = "bg-gray-300"
    } else if (cdate.holiday) {
      bg = "bg-blue-200"
    }

    return <td className={cn(common, b, bcolor, bg, className)}>{children}</td>
  }
}

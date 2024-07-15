import MonthName from "@/components/MonthName"
import {
  CLASSES_BEGIN,
  CLASSES_END,
  SEMESTER,
  SEMESTER_BEGIN,
  SEMESTER_END,
  YEAR,
} from "@/lib/config"
import * as dates from "@/lib/dates"
import type { CalendarDate, SemesterMonth } from "@/lib/dates"
import { dbGroupGetAllWithSlots } from "@/lib/db/groups"
import { dbGetHolidaysForYear } from "@/lib/db/holidays"
import { cn } from "@/lib/utils"

type SessionInfo = {
  group: GroupData
  date: dates.AltDate
  holiday: boolean
  text: string
  shift?: number
}

type GroupData = Awaited<ReturnType<typeof dbGroupGetAllWithSlots>>[number]

const groupSessions = (calendarDates: CalendarDate[], group: GroupData) => {
  const { slots } = group
  const weekdayMap = new Map<number, boolean>(
    slots.map((s) => [s.weekDay, s.lab])
  )

  const thereIsClass = (d: CalendarDate) =>
    !d.holiday && dates.isWithin(CLASSES_BEGIN, d.date, CLASSES_END)

  let currL = 1
  let currT = 1
  let sessions: SessionInfo[] = []
  for (const cdate of calendarDates) {
    const lab = weekdayMap.get(dates.weekday(cdate.date))
    let info: SessionInfo = { group, ...cdate, text: "" }
    if (lab !== undefined && thereIsClass(cdate)) {
      if (lab) {
        info.text = `L${currL}`
        currL++
      } else {
        info.text = `T${currT}`
        currT++
      }
      if (currL > currT) {
        info.shift = currT - currL
      }
    }
    sessions.push(info)
  }
  return sessions
}

export default async function Home() {
  const holidays = await dbGetHolidaysForYear(YEAR, SEMESTER)
  const allDates = dates.allDatesForSemester(YEAR, SEMESTER)
  const cdates = await dates.mergeWithHolidays(allDates, holidays)
  const groups = await dbGroupGetAllWithSlots(YEAR, SEMESTER)
  const allSessions = groups.map((group) => groupSessions(cdates, group))

  return (
    <div className="p-6 w-fit flex flex-col gap-4 items-start">
      {dates.semesterMonths.autumn.map((month, i) => (
        <_MonthTable
          key={i}
          groups={groups}
          sessions={allSessions.map((sessions) =>
            sessions.filter((s) => dates.dateInMonth(s.date, YEAR, month))
          )}
          month={month}
        />
      ))}
    </div>
  )
}

type TableCellProps = {
  session: SessionInfo
  children: React.ReactNode
  header: boolean
}
const TableCell = ({ session, children, header }: TableCellProps) => {
  if (!dates.isWithin(SEMESTER_BEGIN, session.date, SEMESTER_END)) {
    const tomorrow = dates.isTomorrow(session.date, SEMESTER_BEGIN)
    let border = tomorrow ? "border-r" : "border"
    let borderColor = "border-transparent"
    if (tomorrow) {
      borderColor = header ? "border-black" : "border-gray-400"
    }
    return (
      <td className={cn("p-0", border, borderColor)}>
        <div className="w-8"></div>
      </td>
    )
  }
  return (
    <td
      className={cn(
        "border p-0",
        header ? "border-black" : "border-gray-400",
        dates.isWeekend(session.date) && "bg-gray-300",
        session.holiday && "bg-blue-300"
      )}
    >
      {children}
    </td>
  )
}

type _MonthTableProps = {
  sessions: SessionInfo[][]
  groups: GroupData[]
  month: SemesterMonth
}
const _MonthTable = async ({ sessions, groups, month }: _MonthTableProps) => {

  const Session = ({ session }: { session: SessionInfo }) => {
    if (session === undefined) {
      return <div></div>
    } else {
      let shift = session.shift ? -session.shift : 0
      return (
        <div
          className={cn(
            "text-center h-6 text-sm flex flex-col justify-center relative"
          )}
        >
          {session.text}
          <div
            className={cn(
              "absolute left-0 bottom-0 right-0 h-[0.35em]",
              "flex flex-row justify-center items-stretch gap-0.5"
            )}
          >
            {[..."*".repeat(shift)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-red-500"></div>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <MonthName month={month} />
      <table className="border-collapse">
        <tbody>
          <tr>
            <td></td>
            {sessions[0].map((session, i) => (
              <TableCell key={i} session={session} header={true}>
                <div className={cn("w-8 text-center")}>{session.date.day}</div>
              </TableCell>
            ))}
          </tr>
          {groups.map((group, ig) => (
            <tr key={group.id}>
              <td className="text-right pr-2 text-sm">{group.group}</td>
              {sessions[ig].map((session, id) => (
                <TableCell key={id} session={session} header={false}>
                  <Session session={sessions[ig][id]} />
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

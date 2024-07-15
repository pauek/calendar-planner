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

type TableCellProps = {
  cdate: CalendarDate
  children: React.ReactNode
  header: boolean
}

type SessionInfo = {
  text: string
  shift?: number
}

type GroupData = Awaited<ReturnType<typeof dbGroupGetAllWithSlots>>[number]

const groupSessions = (cdates: CalendarDate[], group: GroupData) => {
  const { slots } = group
  const weekdayMap = new Map<number, boolean>(
    slots.map((s) => [s.weekDay, s.lab])
  )

  const thereIsClass = (d: CalendarDate) =>
    !d.holiday && dates.isWithin(CLASSES_BEGIN, d.date, CLASSES_END)

  let currL = 1
  let currT = 1
  let sessions: SessionInfo[] = []
  for (const cdate of cdates) {
    const lab = weekdayMap.get(dates.weekday(cdate.date))
    let info: SessionInfo = { text: "" }
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
  return (
    <div className="p-6 w-fit flex flex-col gap-4 items-start">
      {dates.semesterMonths.autumn.map((month, i) => (
        <_MonthTable key={i} month={month} />
      ))}
    </div>
  )
}

const _MonthTable = async ({ month }: { month: SemesterMonth }) => {
  const groups = await dbGroupGetAllWithSlots(YEAR, SEMESTER)
  const holidays = await dbGetHolidaysForYear(YEAR, SEMESTER)
  const allDates = dates.allDatesForMonth(YEAR, month)
  const cdates = await dates.mergeWithHolidays(allDates, holidays)

  const TableCell = ({ cdate, children, header }: TableCellProps) => {
    if (!dates.isWithin(SEMESTER_BEGIN, cdate.date, SEMESTER_END)) {
      const tomorrow = dates.isTomorrow(cdate.date, SEMESTER_BEGIN)
      return (
        <td
          className={cn(
            "p-0",
            tomorrow
              ? header
                ? "border-black"
                : "border-gray-400"
              : "border-transparent",
            tomorrow ? "border-r" : "border"
          )}
        >
          <div className="w-8"></div>
        </td>
      )
    }
    return (
      <td
        className={cn(
          "border p-0",
          header ? "border-black" : "border-gray-400",
          dates.isWeekend(cdate.date) && "bg-gray-300",
          cdate.holiday && "bg-blue-300"
        )}
      >
        {children}
      </td>
    )
  }

  const sessions = groups.map((group) => groupSessions(cdates, group))

  const Session = ({ session }: { session: SessionInfo }) => {
    if (session === undefined) {
      return <div></div>
    } else {
      let shift = ""
      if (session.shift === -1) {
        shift = "bg-red-200"
      } else if (session.shift === -2) {
        shift = "bg-red-400"
      }
      return (
        <div className={cn("text-center py-0.5", shift)}>{session.text}</div>
      )
    }
  }

  return (
    <table className="border-collapse">
      <tbody>
        <tr>
          <td></td>
          {cdates.map((cdate, i) => (
            <TableCell key={i} cdate={cdate} header={true}>
              <div className={cn("w-8 text-center")}>{cdate.date.day}</div>
            </TableCell>
          ))}
        </tr>
        {groups.map((group, ig) => (
          <tr key={group.id}>
            <td className="text-right pr-2 text-sm">{group.group}</td>
            {cdates.map((d, id) => (
              <TableCell key={id} cdate={d} header={false}>
                <Session session={sessions[ig][id]} />
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

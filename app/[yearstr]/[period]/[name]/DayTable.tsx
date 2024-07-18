import type { CalendarDate } from "@/lib/dates"
import * as dates from "@/lib/dates"
import { GroupWithSlots } from "@/lib/db/courses"
import { SemesterWithLimits } from "@/lib/db/semester"
import { cn } from "@/lib/utils"
import TableCell from "./TableCell"
import Session from "./Session"

type DayTableProps = {
  weekTitles: boolean
  dbSemester: SemesterWithLimits
  sessions: dates.SessionInfo[][]
  cdates: CalendarDate[]
  groups: GroupWithSlots[] | undefined
}
export default function DayTable({
  weekTitles,
  dbSemester,
  sessions,
  cdates,
  groups,
}: DayTableProps) {
  return (
    <table className="border-collapse select-none">
      <tbody>
        <tr>
          <td className="w-8"></td>
          {cdates.map((cdate, i) => (
            <TableCell
              key={i}
              className="relative"
              dbSemester={dbSemester}
              cdate={cdate}
              header={true}
            >
              {weekTitles && dbSemester.start && cdate.dow === 1 && (
                <div
                  className={cn(
                    "absolute -top-[1.1rem] -left-[.3em] w-8 text-center text-xs",
                    "text-gray-500 overflow-visible text-nowrap",
                    "font-semibold border-black pl-1"
                  )}
                >
                  SETMANA {1 + dates.weekDifference(cdate.date, dbSemester.start)}
                </div>
              )}
              <div className={cn("w-8 text-center")}>{cdate.date.day}</div>
            </TableCell>
          ))}
        </tr>
        {groups &&
          groups.map((group, ig) => (
            <tr key={group.id}>
              <td className="text-right pr-2 w-8 text-sm text-stone-400">{group.group}</td>
              {sessions[ig].map((session, id) => (
                <TableCell key={id} dbSemester={dbSemester} cdate={session} header={false}>
                  <Session session={sessions[ig][id]} />
                </TableCell>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  )
}

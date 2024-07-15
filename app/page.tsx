import { SEMESTER, YEAR } from "@/lib/config"
import {
  allDatesWithHolidays,
  CalendarDate,
  isWeekend,
  weekday,
} from "@/lib/dates"
import { dbGroupGetAllWithSlots } from "@/lib/db/groups"
import { cn } from "@/lib/utils"

type TableCellProps = {
  cdate: CalendarDate
  children: React.ReactNode
  header: boolean
}

type GroupData = Awaited<ReturnType<typeof dbGroupGetAllWithSlots>>[number]

const groupSessions = (cdates: CalendarDate[], group: GroupData) => {
  const { slots } = group
  const weekdayMap = new Map<number, boolean>(
    slots.map((s) => [s.weekDay, s.lab])
  )

  let currL = 1;
  let currT = 1;
  let sessions: string[] = []
  for (const cdate of cdates) {
    const wd = weekday(cdate.date)
    const lab = weekdayMap.get(wd);
    if (lab === undefined || cdate.holiday) {
      sessions.push("");
    } else if (lab) {
      sessions.push(`L${currL}`);
      currL++;
    } else {
      sessions.push(`T${currT}`);
      currT++;
    }
  }
  return sessions
}

export default async function Home() {
  const groups = await dbGroupGetAllWithSlots(YEAR, SEMESTER)
  const cdates = await allDatesWithHolidays(YEAR, SEMESTER)

  const TableCell = ({ cdate, children, header }: TableCellProps) => {
    return (
      <td
        className={cn(
          "border",
          header ? "border-black" : "border-gray-400",
          isWeekend(cdate.date) && "bg-gray-300",
          cdate.holiday && "bg-blue-300"
        )}
      >
        {children}
      </td>
    )
  }

  const sessions = groups.map((group) => groupSessions(cdates, group))

  const Session = ({ session }: { session: string }) => {
    if (session === undefined) {
      return <div></div>
    } else {
      return <div className="text-center">{session}</div>
    }
  }

  return (
    <div className="p-6 w-fit">
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
              <td className="text-right pr-2 text-sm h-8">{group.group}</td>
              {cdates.map((d, id) => (
                <TableCell key={id} cdate={d} header={false}>
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

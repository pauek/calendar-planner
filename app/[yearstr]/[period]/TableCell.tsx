import type { CalendarDate } from "@/lib/dates"
import * as dates from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"
import { cn } from "@/lib/utils"

type TableCellProps = {
  dbSemester: SemesterWithLimits
  cdate: CalendarDate
  children: React.ReactNode
  header: boolean
  className?: string
}
export default function TableCell({
  dbSemester,
  cdate,
  children,
  header,
  className,
}: TableCellProps) {
  if (cdate === undefined) {
    return <td></td>
  }

  const common = "p-0 h-[1px]"

  const _TransparentTableCell = () => {
    const tomorrow = dates.isTomorrow(cdate.date, dbSemester.start)
    let br = ""
    if (tomorrow) {
      br = "border-r"
      if (dates.isWeekend(cdate.date)) {
        br = "border-r-2 border-r-black"
      }
    }
    return (
      <td className={cn(common, "border border-transparent", br, className)}>
        <div className="w-8"></div>
      </td>
    )
  }

  const _NormalTableCell = () => {
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

  if (!dates.isWithin(dbSemester.start, cdate.date, dbSemester.end)) {
    return _TransparentTableCell()
  } else {
    return _NormalTableCell()
  }
}

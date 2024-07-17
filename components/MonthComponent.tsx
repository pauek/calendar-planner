import {
  allDatesForMonthBetween,
  groupIntoWeeks,
  isWeekend,
  MaybeAltDate,
  mondayOfWeek,
  Period,
  SemesterMonth,
  weekDifference,
} from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"
import { dbSpecialDaysGetForMonth } from "@/lib/db/special-days"
import { cn } from "@/lib/utils"
import HolidayButton from "./HolidayButton"
import MonthName from "./MonthName"

type MonthComponentProps = {
  semester: SemesterWithLimits
  month: SemesterMonth
}

export default async function MonthComponent({ semester, month }: MonthComponentProps) {
  const { year, start, end } = semester
  if (start === undefined) {
    throw new Error(`Semester missing start date!`)
  }

  const weeks = groupIntoWeeks(allDatesForMonthBetween(year, month, start, end))

  const specialDays = await dbSpecialDaysGetForMonth(
    year,
    semester.semester as Period,
    month.month
  )
  console.log(specialDays);
  const nonClass = new Set(specialDays.filter((d) => d.type === "no-class").map((d) => d.date.day))

  const DateCell = ({ date }: { date: MaybeAltDate }) => {
    let border = ""
    let background = ""
    if (date) {
      border = "border border-black"
      if (isWeekend(date)) {
        background = "bg-gray-300"
      } else if (nonClass.has(date.day)) {
        background = "bg-blue-300"
      }
    }
    return <td className={cn(border, background)}>{date && <HolidayButton date={date} />}</td>
  }

  const WeekRow = ({ week }: { week: MaybeAltDate[] }) => {
    const fow = mondayOfWeek(week)
    const weekNum = 1 + weekDifference(fow, start)
    return (
      <tr>
        <td
          className={cn(
            "pr-3 text-right text-xs text-gray-500",
            weekNum >= 16 ? "invisible" : "visible"
          )}
        >
          {weekNum > 0 ? weekNum : undefined}
        </td>
        {week.map((d, i) => (
          <DateCell key={i} date={d} />
        ))}
      </tr>
    )
  }

  return (
    <div className="w-[24em] flex flex-col items-center mt-2">
      <MonthName month={month} />
      <table className="border-collapse">
        <tbody>
          {weeks.map((week, i) => (
            <WeekRow key={i} week={week} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

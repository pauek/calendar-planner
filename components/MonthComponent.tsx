import {
  allDatesForMonthBetween,
  groupIntoWeeks,
  isWeekend,
  MaybeAltDate,
  mondayOfWeek,
  SemesterMonth,
  sortSpecialDayTypes,
  SpecialDayType,
  weekDifference,
} from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"
import { SpecialDay } from "@/lib/db/special-days"
import { cn } from "@/lib/utils"
import HolidayButton from "./HolidayButton"
import MonthName from "./MonthName"

type MonthComponentProps = {
  semester: SemesterWithLimits
  month: SemesterMonth
  specialDays: SpecialDay[]
  type: SpecialDayType
}

export default function MonthComponent({
  specialDays,
  semester,
  month,
  type,
}: MonthComponentProps) {
  const { year, start, end } = semester

  const weeks = groupIntoWeeks(allDatesForMonthBetween(year, month, start, end))

  const special = new Map<number, SpecialDayType[]>()
  for (const spday of specialDays.filter(d => d.date.month === month.month)) {
    const types = special.get(spday.date.day)
    if (types === undefined) {
      special.set(spday.date.day, [spday.type])
    } else {
      types.push(spday.type)
      sortSpecialDayTypes(types)
    }
  }

  const DateCell = ({ date }: { date: MaybeAltDate }) => {
    let border = ""
    let background = ""
    if (date) {
      border = "border border-black"
      if (isWeekend(date)) {
        background = "bg-gray-300"
      } else if (special.has(date.day)) {
        const types = special.get(date.day)
        if (types && types.length > 0) {
          background = `bg-${types[0]}`
        }
      }
    }
    return (
      <td className={cn(border, background)}>
        {date && <HolidayButton date={date} type={type} />}
      </td>
    )
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

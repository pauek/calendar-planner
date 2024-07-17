"use client"

import { actionToggleSpecialDay } from "@/actions/special_days"
import { AltDate, date2str, isWeekend, SpecialDayType } from "@/lib/dates"
import { cn } from "@/lib/utils"

type HolidayButtonProps = {
  date: AltDate
  type: SpecialDayType
}
export default function HolidayButton({ date, type }: HolidayButtonProps) {
  const common = "px-3 w-10 h-6 text-center select-none"
  if (isWeekend(date)) {
    return <div className={cn(common)}>{date.day}</div>
  }
  return (
    <div
      onClick={() => actionToggleSpecialDay(date, type)}
      className={cn("text-center cursor-pointer select-none hover:outline", common)}
      title={date2str(date)}
    >
      {date.day}
    </div>
  )
}

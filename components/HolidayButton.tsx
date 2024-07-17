"use client"

import { actionToggleHoliday } from "@/actions/special_days"
import { AltDate, date2str, isWeekend } from "@/lib/dates"

type HolidayButtonProps = {
  date: AltDate
}
export default function HolidayButton({ date }: HolidayButtonProps) {
  if (isWeekend(date)) {
    return <div className="px-3 text-center select-none">{date.day}</div>
  }
  return (
    <div
      onClick={() => actionToggleHoliday(date)}
      className="px-3 text-center cursor-pointer select-none hover:outline"
      title={date2str(date)}
    >
      {date.day}
    </div>
  )
}

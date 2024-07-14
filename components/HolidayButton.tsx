"use client";

import { actionToggleHoliday } from "@/actions/holidays";
import { DateOnly, dateOnly2date, isWeekend } from "@/lib/dates";
import React from "react";

type HolidayButtonProps = {
  date: DateOnly;
};
export default function HolidayButton({ date }: HolidayButtonProps) {
  if (isWeekend(date)) {
    return <div className="px-4 text-center select-none">{date.day}</div>;
  }
  return (
    <div
      onClick={() => actionToggleHoliday(date)}
      className="px-4 text-center cursor-pointer select-none hover:outline"
      title={date.toString()}
    >
      {date.day}
    </div>
  );
}

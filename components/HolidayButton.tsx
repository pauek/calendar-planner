"use client";

import { actionToggleHoliday } from "@/actions/holidays";
import { isWeekend } from "@/lib/dates";
import React from "react";

export default function HolidayButton({ date }: { date: Date }) {
  if (isWeekend(date)) {
    return <div className="px-4 text-center select-none">{date.getDate()}</div>;
  }
  return (
    <div
      onClick={() => actionToggleHoliday(date)}
      className="px-4 text-center cursor-pointer select-none hover:outline"
      title={date.toString()}
    >
      {date.getDate()}
    </div>
  );
}

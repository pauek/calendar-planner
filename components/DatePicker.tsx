"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import {
  actionSpecialDayRemoveForCourse,
  actionSpecialDaySetForCourse,
} from "@/actions/special_days"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { date2altdate, SpecialDayType } from "@/lib/dates"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  initialDate: Date | undefined
  courseId: number
  type: SpecialDayType
}
export function DatePicker({ initialDate, courseId, type }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate)

  const saveDate = async (date: Date | undefined) => {
    if (date) {
      await actionSpecialDaySetForCourse(courseId, date2altdate(date), type)
    } else {
      await actionSpecialDayRemoveForCourse(courseId, type)
    }
    setDate(date);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={saveDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

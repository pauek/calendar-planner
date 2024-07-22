"use client"

import MonthComponent from "@/components/MonthComponent"
import { Period, semesterMonths, SpecialDayType } from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"
import { SpecialDay } from "@/lib/db/special-days"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

type SpecialDaysEditorProps = {
  semester: SemesterWithLimits
  specialDays: SpecialDay[]
}
export default function SpecialDaysEditor({ semester, specialDays }: SpecialDaysEditorProps) {
  const period: Period = semester.period as Period

  const [type, setType] = useState<SpecialDayType>("no-class")

  return (
    <div className="flex flex-row item-stretch">
      <div className="pt-4 flex flex-col">
        {semesterMonths[period].map((m, i) => (
          <MonthComponent
            key={i}
            semester={semester}
            month={m}
            specialDays={specialDays}
            type={type}
          />
        ))}
      </div>
      <div className="p-4">
        <RadioGroup
          className="flex flex-col gap-3"
          value={type}
          onValueChange={(s) => setType(s as SpecialDayType)}
        >
          <div>
            <RadioGroupItem value="no-class" id="no-class" className="peer sr-only" />
            <Label
              htmlFor="no-class"
              className="flex flex-row gap-3 items-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className={cn("w-10 h-6 border border-black", "bg-no-class")}></div>
              Dies no lectius
            </Label>
          </div>
          <div>
            <RadioGroupItem value="partial-exam-period" id="partial-exam-period" className="peer sr-only" />
            <Label
              htmlFor="partial-exam-period"
              className="flex flex-row gap-3 items-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className={cn("w-10 h-6 border border-black", "bg-partial-exam-period")}></div>
              Exàmens Parcials
            </Label>
          </div>
          <div>
            <RadioGroupItem value="final-exam-period" id="final-exam-period" className="peer sr-only" />
            <Label
              htmlFor="final-exam-period"
              className="flex flex-row gap-3 items-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className={cn("w-10 h-6 border border-black", "bg-final-exam-period")}></div>
              Exàmens Finals
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

"use client"

import MonthComponent from "@/components/MonthComponent"
import { Period, semesterMonths, SpecialDayType } from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { useState } from "react"
import { SpecialDay } from "@/lib/db/special-days"

type SpecialDaysEditorProps = {
  semester: SemesterWithLimits
  specialDays: SpecialDay[]
}
export default function SpecialDaysEditor({ semester, specialDays }: SpecialDaysEditorProps) {
  const period: Period = semester.period as Period

  const [type, setType] = useState<SpecialDayType>("partial-exam")

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
              <div className="w-10 h-6 border border-black bg-blue-300"></div>
              Dies no lectius
            </Label>
          </div>
          <div>
            <RadioGroupItem value="partial-exam" id="partial-exam" className="peer sr-only" />
            <Label
              htmlFor="partial-exam"
              className="flex flex-row gap-3 items-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="w-10 h-6 border border-black bg-green-300"></div>
              Exàmens Parcials
            </Label>
          </div>
          <div>
            <RadioGroupItem value="final-exam" id="final-exam" className="peer sr-only" />
            <Label
              htmlFor="final-exam"
              className="flex flex-row gap-3 items-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="w-10 h-6 border border-black bg-red-300"></div>
              Exàmens Finals
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Period, periodText } from "@/lib/dates"
import { DBSemester } from "@/lib/db/semester"
import { redirect, usePathname } from "next/navigation"

type SelectorSemesterProps = {
  semesters: DBSemester[]
}
export default function SemesterCourseSelector({ semesters }: SelectorSemesterProps) {
  const path = usePathname()
  
  return (
    <Select onValueChange={redirect} defaultValue={path}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Semester" />
      </SelectTrigger>
      <SelectContent>
        {semesters.map(({ year, period }, i) => (
          <SelectItem key={i} value={`/${year}/${period}`}>
            {periodText(year, period as Period)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

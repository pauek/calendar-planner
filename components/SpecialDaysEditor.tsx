import MonthComponent from "@/components/MonthComponent"
import { Period, semesterMonths } from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"

type SpecialDaysEditorProps = {
  semester: SemesterWithLimits
}
export default function SpecialDaysEditor({ semester }: SpecialDaysEditorProps) {
  const sem: Period = semester.semester as Period;
  return (
    <div className="flex flex-col">
      {semesterMonths[sem].map((m, i) => (
        <MonthComponent key={i} semester={semester} month={m} />
      ))}
    </div>
  )
}

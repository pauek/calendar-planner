import MonthComponent from "@/components/MonthComponent"
import { Period, semesterMonths } from "@/lib/dates"
import { SemesterWithLimits } from "@/lib/db/semester"

type SpecialDaysEditorProps = {
  semester: SemesterWithLimits
}
export default function SpecialDaysEditor({ semester }: SpecialDaysEditorProps) {
  const period: Period = semester.period as Period;
  return (
    <div className="flex flex-col">
      {semesterMonths[period].map((m, i) => (
        <MonthComponent key={i} semester={semester} month={m} />
      ))}
    </div>
  )
}

import { getMonthName, type SemesterMonth } from "@/lib/dates"
import { cn } from "@/lib/utils"

export default function MonthName({ className, month }: { className?: string, month: SemesterMonth }) {
  return (
    <h4 className={cn("mb-1 text-sm font-semibold text-gray-500", className)}>
      {getMonthName(month).toUpperCase()}
    </h4>
  )
}

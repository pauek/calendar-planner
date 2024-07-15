import { getMonthName, type SemesterMonth } from "@/lib/dates"

export default function MonthName({ month }: { month: SemesterMonth }) {
  return (
    <h4 className="mb-1 text-sm font-semibold text-gray-500 pl-[1.6rem]">
      {getMonthName(month).toUpperCase()}
    </h4>
  )
}

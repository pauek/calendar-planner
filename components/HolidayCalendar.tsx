import MonthComponent from "@/components/MonthComponent";
import { semester, year } from "@/lib/config";
import { semesterMonths } from "@/lib/dates";

export default function HolidayCalendar() {
  return (
    <div className="flex flex-col">
      {semesterMonths[semester].map((m) => (
        <MonthComponent
          key={`${year}-${m.month}`}
          year={year}
          semester={semester}
          semesterStart={{ year: 2024, month: 9, day: 9 }}
          month={m}
        />
      ))}
    </div>
  );
}

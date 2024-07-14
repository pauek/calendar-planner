import MonthComponent from "@/components/MonthComponent";
import { SEMESTER, YEAR } from "@/lib/config";
import { semesterMonths } from "@/lib/dates";

export default function HolidaysEditor() {
  return (
    <div className="flex flex-col">
      {semesterMonths[SEMESTER].map((m) => (
        <MonthComponent
          key={`${YEAR}-${m.month}`}
          year={YEAR}
          semester={SEMESTER}
          semesterStart={{ year: 2024, month: 9, day: 9 }}
          month={m}
        />
      ))}
    </div>
  );
}

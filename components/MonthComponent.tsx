import {
  allDatesForMonth,
  mondayOfWeek,
  getMonthName,
  groupIntoWeeks,
  isWeekend,
  MaybeAltDate,
  SemesterMonth,
  Semester,
  weekDifference,
  AltDate,
} from "@/lib/dates";
import { dbGetHolidaysForMonth } from "@/lib/db/holidays";
import { cn } from "@/lib/utils";
import HolidayButton from "./HolidayButton";

type MonthComponentProps = {
  year: number;
  semester: Semester;
  semesterStart: AltDate;
  month: SemesterMonth;
};

export default async function MonthComponent({
  year,
  semester,
  month,
  semesterStart,
}: MonthComponentProps) {
  const monthName = getMonthName(month);
  const weeks = groupIntoWeeks(allDatesForMonth(year, month, true));

  const holidays = await dbGetHolidaysForMonth(year, semester, month.month);
  const holidaySet = new Set(holidays.map((d) => d.day));

  const DateCell = ({ d }: { d: MaybeAltDate }) => {
    return (
      <td
        className={cn(
          "border-black",
          isWeekend(d) && "bg-gray-300",
          d && "border",
          d && holidaySet.has(d.day) && "bg-blue-300"
        )}
      >
        {d && <HolidayButton date={d} />}
      </td>
    );
  };

  const WeekRow = ({ week }: { week: MaybeAltDate[] }) => {
    const fow = mondayOfWeek(week);
    const weekNum = 1 + weekDifference(fow, semesterStart);
    return (
      <tr>
        <td
          className={cn(
            "pr-3 text-right text-xs text-gray-500",
            weekNum >= 16 ? "invisible" : "visible"
          )}
        >
          {weekNum > 0 ? weekNum : undefined}
        </td>
        {week.map((d, i) => (
          <DateCell key={i} d={d} />
        ))}
      </tr>
    );
  };

  return (
    <div className="w-[24em] flex flex-col items-center mt-2">
      <h4 className="text-md font-bold text-gray-500 text-center mb-0">
        {monthName.toUpperCase()}
      </h4>
      <table className="border-collapse">
        <tbody>
          {weeks.map((week, i) => (
            <WeekRow key={i} week={week} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

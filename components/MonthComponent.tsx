import {
  allDatesForMonth,
  mondayOfWeek,
  getMonthName,
  groupIntoWeeks,
  isWeekend,
  MaybeDate,
  SemesterMonth,
  Semester,
  weekDifference,
  DateOnly,
} from "@/lib/dates";
import { dbGetHolidaysForMonth } from "@/lib/db/holidays";
import { cn } from "@/lib/utils";
import HolidayButton from "./HolidayButton";

type MonthComponentProps = {
  year: number;
  semester: Semester;
  semesterStart: DateOnly;
  month: SemesterMonth;
};

export default async function MonthComponent({
  year,
  semester,
  month,
  semesterStart,
}: MonthComponentProps) {
  const monthName = getMonthName(month);
  const weeks = groupIntoWeeks(allDatesForMonth(year, month));

  const holidays = await dbGetHolidaysForMonth(
    year + month.yearDif,
    semester,
    month.month
  );
  console.log(monthName, holidays);

  const holidaySet = new Set(holidays.map((d) => d.day));

  const DateCell = ({ d }: { d: MaybeDate }) => {
    return (
      <td
        className={cn(
          "border-black",
          isWeekend(d) && "bg-blue-300",
          d && "border",
          d && holidaySet.has(d.day) && "bg-blue-300"
        )}
      >
        {d && <HolidayButton date={d} />}
      </td>
    );
  };

  const WeekRow = ({ week }: { week: MaybeDate[] }) => {
    const fow = mondayOfWeek(week);
    const weekNum = 1 + weekDifference(fow, semesterStart);
    return (
      <tr>
        <td className={cn("pr-2", weekNum >= 16 ? "invisible" : "visible")}>
          {weekNum > 0 ? weekNum : undefined}
        </td>
        {week.map((d, i) => (
          <DateCell key={i} d={d} />
        ))}
      </tr>
    );
  };

  return (
    <div className="w-[24em] flex flex-col items-center">
      <h3 className="text-center ">{monthName}</h3>
      <table className="border-collapse mb-2">
        <tbody>
          {weeks.map((week, i) => (
            <WeekRow key={i} week={week} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

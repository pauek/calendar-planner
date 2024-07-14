import {
  allDatesForMonth,
  firstOfWeek,
  getMonthName,
  groupIntoWeeks,
  isWeekend,
  MaybeDate,
  Month,
  Semester,
  weekDifference,
} from "@/lib/dates";
import { dbGetHolidaysForMonth } from "@/lib/db/holidays";
import { cn } from "@/lib/utils";
import HolidayButton from "./HolidayButton";

type MonthComponentProps = {
  year: number;
  semester: Semester;
  semesterStart: Date;
  month: Month;
};

export default async function MonthComponent({
  year,
  semester,
  month,
  semesterStart,
}: MonthComponentProps) {
  const weeks = groupIntoWeeks(allDatesForMonth(year, month));
  const holidays = await dbGetHolidaysForMonth(
    year + month.yearDif,
    semester,
    month.month
  );
  const holidaySet = new Set(holidays.map((d) => d.getDate()));

  const DateCell = ({ d }: { d: MaybeDate }) => {
    return (
      <td
        className={cn(
          "border-black",
          isWeekend(d) && "bg-blue-300",
          d && "border",
          d && holidaySet.has(d.getDate()) && "bg-blue-300"
        )}
      >
        {d && <HolidayButton date={d} />}
      </td>
    );
  };

  const WeekRow = ({ week }: { week: MaybeDate[] }) => {
    const fow = firstOfWeek(week);
    const weekNum = 1 + weekDifference(fow, semesterStart);
    return (
      <tr>
        <td className="pr-2">{weekNum > 0 ? weekNum : undefined}</td>
        {week.map((d, i) => (
          <DateCell key={i} d={d} />
        ))}
      </tr>
    );
  };

  return (
    <div className="w-[24em] flex flex-col items-center">
      <h3 className="text-center ">{getMonthName(month)}</h3>
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

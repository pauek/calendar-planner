import { SEMESTER, YEAR } from "@/lib/config";
import { allDatesForSemester, date2str, AltDate, isWeekend } from "@/lib/dates";
import { dbGroupGetAllWithSlots } from "@/lib/db/groups";
import { dbGetHolidaysForYear } from "@/lib/db/holidays";
import { cn } from "@/lib/utils";

type TableCellProps = {
  date: AltDate;
  children: React.ReactNode;
};



export default async function Home() {
  const holidays = await dbGetHolidaysForYear(YEAR, SEMESTER);
  const holidaySet = new Set(holidays.map(date2str));

  const groups = await dbGroupGetAllWithSlots(YEAR, SEMESTER);
  const groupNumbers = new Set(groups.map(g => g.group.slice(1)));
  const dates = allDatesForSemester(YEAR, SEMESTER).slice(6);

  const TableCell = ({ date, children }: TableCellProps) => {
    return (
      <td
        className={cn(
          "border border-gray-600",
          isWeekend(date) && "bg-gray-300",
          date && holidaySet.has(date2str(date)) && "bg-blue-300"
        )}
      >
        {children}
      </td>
    );
  };

  return (
    <div className="p-6 w-fit">
      <table className="border-collapse">
        <tbody>
          <tr>
            <td></td>
            {dates.map((d, i) => (
              <TableCell key={i} date={d}>
                <div className={cn("w-8 text-center")}>{d.day}</div>
              </TableCell>
            ))}
          </tr>
          {groups.map((group) => (
            <tr key={group.id}>
              <td className="text-right pr-2 text-sm h-8">{group.group}</td>
              {dates.map((d, i) => (
                <TableCell key={i} date={d}>
                  <div></div>
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

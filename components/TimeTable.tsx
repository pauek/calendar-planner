import { hour2str, Slot, WEEK_DAYS, WEEK_HOURS } from "@/lib/dates";
import { GroupWithSlots } from "@/lib/db/groups";
import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

type TimeTableProps = {
  groups: GroupWithSlots[];
  slots: Set<string>;
  onClick: (day: string, hour: string) => void;
};
export default function TimeTable({ groups, slots, onClick }: TimeTableProps) {
  const handleClick: MouseEventHandler<HTMLTableCellElement> = (e) => {
    const tableCell = e.target as HTMLTableCellElement;
    const { day, hour } = tableCell.dataset;
    if (!day || !hour) {
      throw new Error(`Missing 'data-day' or 'data-hour' in <td>!`);
    }
    onClick(day, hour);
  };

  const slotPosition = (slot: Slot) => {
    const top = (slot.startHour - 8) * 2 + 2;
    const left = slot.weekDay * 10 + 2;
    const height = (slot.endHour - slot.startHour) * 2;
    return { top: `${top}em`, left: `${left}em`, height: `${height}em` };
  };

  return (
    <div className="relative">
      {groups.map((g, i) =>
        g.slots.map((slot) => (
          <div
            className={cn(
              "absolute slot -z-10 text-black opacity-50",
              "outline -outline-offset-[4px] outline-1 outline-gray-500"
            )}
            style={slotPosition(slot)}
            key={i}
          >
            {g.group}
          </div>
        ))
      )}

      <table className="border-collapse timetable mb-6 z-10">
        <tbody>
          <tr>
            <td className="hour">
              <div>{WEEK_HOURS[0]}h</div>
            </td>
            {WEEK_DAYS.map((wd) => (
              <th className="text-center font-bold select-none" key={wd}>
                {wd}
              </th>
            ))}
          </tr>
          {WEEK_HOURS.slice(1).map((h) => (
            <tr key={h}>
              <td className="hour">
                <div className="select-none">{h}h</div>
              </td>
              {WEEK_DAYS.map((_, i) => (
                <td
                  key={i}
                  data-hour={h - 1}
                  data-day={WEEK_DAYS[i]}
                  className={cn(
                    "cursor-pointer hover:outline outline-gray-500 outline-2",
                    slots.has(hour2str(WEEK_DAYS[i], String(h - 1))) &&
                      "bg-black opacity-80"
                  )}
                  onClick={handleClick}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

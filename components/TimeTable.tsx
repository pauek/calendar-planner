import { SLOT_MARGIN, SLOT_WIDTH } from "@/lib/config";
import { hour2str, Slot, WEEK_DAYS, WEEK_HOURS, WORK_DAYS } from "@/lib/dates";
import { GroupWithSlots } from "@/lib/db/groups";
import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

type TimeTableProps = {
  groups: GroupWithSlots[];
  lab: boolean;
  slots: Set<string>;
  onClick: (day: string, hour: string) => void;
};
export default function TimeTable({
  groups,
  lab,
  slots,
  onClick,
}: TimeTableProps) {
  const handleClick: MouseEventHandler<HTMLTableCellElement> = (e) => {
    const tableCell = e.target as HTMLTableCellElement;
    const { day, hour } = tableCell.dataset;
    if (!day || !hour) {
      throw new Error(`Missing 'data-day' or 'data-hour' in <td>!`);
    }
    onClick(day, hour);
  };

  const slotPosition = (slot: Slot) => {
    const top = (slot.startHour - 8) * 2 + 1.65;
    const left = (slot.weekDay - 1) * 10 + 1.98;
    const height = (slot.endHour - slot.startHour) * 2 - SLOT_MARGIN * 2;
    return {
      top: `${top}rem`,
      left: `${left}rem`,
      height: `${height}rem`,
      width: `${SLOT_WIDTH - SLOT_MARGIN * 2 - 0.05}rem`,
      margin: `${SLOT_MARGIN}rem`,
    };
  };

  return (
    <div className="relative">
      {groups.map((g, i) =>
        g.slots.map((slot) => (
          <div
            className={cn(
              "absolute -z-10 w-[10em] text-black",
              "border border-gray-300 opacity-50 rounded",
              "h-[2em] flex flex-col items-center justify-center",
              slot.lab ? "bg-orange-100" : "bg-blue-100"
            )}
            style={slotPosition(slot)}
            key={i}
          >
            {slot.lab ? "L" : "T"}
            {g.group}
          </div>
        ))
      )}

      <table className="border-collapse timetable mb-6 z-10">
        <tbody>
          <tr>
            <td className="pr-2">
              <div className="relative -bottom-[1.3em] text-xs text-right">
                {WEEK_HOURS[0]}h
              </div>
            </td>
            {WORK_DAYS.map((wd) => (
              <th
                className="text-center font-bold select-none border-none"
                key={wd}
              >
                {wd}
              </th>
            ))}
          </tr>
          {WEEK_HOURS.slice(1).map((h) => (
            <tr key={h}>
              <td className="pr-2">
                <div className="select-none relative -bottom-[1.3em] text-xs text-right">
                  {h}h
                </div>
              </td>
              {WORK_DAYS.map((_, i) => (
                <td
                  key={i}
                  data-hour={h - 1}
                  data-day={WORK_DAYS[i]}
                  className={cn(
                    "cursor-pointer hover:outline outline-gray-500 outline-2",
                    "h-[2em] w-[10em]",
                    slots.has(hour2str(WORK_DAYS[i], String(h - 1))) &&
                      (lab
                        ? "bg-orange-600 opacity-60"
                        : "bg-blue-600 opacity-60")
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

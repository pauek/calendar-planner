"use client";

import { actionAddGroup } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { semester, year } from "@/lib/config";
import { selectedHoursToIntervals, weekDays, weekHours } from "@/lib/dates";
import { cn, setToggleElement } from "@/lib/utils";
import { MouseEventHandler, useState } from "react";

type Slot = {
  weekDay: number;
  startHour: number;
  endHour: number;
};
type TimetableProps = {
  groups: {
    group: string;
    slots: Slot[];
  }[];
};
export default function Timetable({ groups }: TimetableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const intervals = selectedHoursToIntervals(selected);

  const hour2str = (weekday: string | undefined, hour: string | undefined) =>
    `${weekday} ${hour?.padStart(2, "0")}`;

  const onClick: MouseEventHandler<HTMLTableCellElement> = (e) => {
    const tableCell = e.target as HTMLTableCellElement;
    const { day, hour } = tableCell.dataset;
    setSelected((prev) => setToggleElement(prev, hour2str(day, hour)));
  };

  const addGroup = async (data: FormData) => {
    const group = data.get("group")?.valueOf() as string;
    await actionAddGroup(year, semester, group, intervals);
    setSelected(new Set());
  };

  const slotTailwindOffsets = (slot: Slot) => {
    const top = (slot.startHour - 8) * 2 + 2;
    const left = slot.weekDay * 10 + 2;
    const height = (slot.endHour - slot.startHour) * 2;
    return { top: `${top}em`, left: `${left}em`, height: `${height}em` };
  };

  return (
    <div className="pl-6">
      <div className="relative">
        {groups.map((g, i) =>
          g.slots.map((slot) => (
            <div
              className="absolute slot -z-10 text-black opacity-50 outline -outline-offset-[4px] outline-1 outline-gray-500"
              style={slotTailwindOffsets(slot)}
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
                <div>{weekHours[0]}h</div>
              </td>
              {weekDays.map((wd) => (
                <th className="text-center font-bold select-none" key={wd}>
                  {wd}
                </th>
              ))}
            </tr>
            {weekHours.slice(1).map((h) => (
              <tr key={h}>
                <td className="hour">
                  <div className="select-none">{h}h</div>
                </td>
                {weekDays.map((_, i) => (
                  <td
                    key={i}
                    data-hour={h - 1}
                    data-day={weekDays[i]}
                    className={cn(
                      "cursor-pointer hover:outline outline-gray-500 outline-2",
                      selected.has(hour2str(weekDays[i], String(h - 1))) &&
                        "bg-blue-200 opacity-80"
                    )}
                    onClick={onClick}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="min-h-[10em] flex flex-col items-start">
        <table>
          <tbody>
            {selectedHoursToIntervals(selected).map((ival, i) => (
              <tr key={i}>
                <td className="pr-2">{ival.weekDay}</td>
                <td className="text-right pr-1">{ival.startHour}h</td>
                <td className="text-gray-500">&ndash;</td>
                <td className="text-right">{ival.endHour}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        action={addGroup}
        className="flex flex-col gap-2 items-start max-w-[30em]"
      >
        <Input type="text" name="group" placeholder="Codi del grup" />
        <Button>Add</Button>
      </form>
    </div>
  );
}

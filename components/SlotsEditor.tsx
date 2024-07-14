"use client";

import { hour2str } from "@/lib/dates";
import { GroupWithSlots } from "@/lib/db/groups";
import { setToggleElement } from "@/lib/utils";
import { useState } from "react";
import SlotsEditorForm from "./SlotsEditorForm";
import SlotSummary from "./SlotSummary";
import TimeTable from "./TimeTable";

type TimetableProps = {
  groups: GroupWithSlots[];
};
export default function SlotsEditor({ groups }: TimetableProps) {
  const [selectedGroup, setSelectedGroup] = useState<number>(-1);
  const [slots, setSlots] = useState<Set<string>>(new Set());
  const [lab, setLab] = useState<boolean>(false);

  const tableClick = (day: string, hour: string) => {
    setSlots((prev) => setToggleElement(prev, hour2str(day, hour)));
  };

  return (
    <div className="pl-6 flex flex-col items-start gap-3">
      <SlotsEditorForm
        groups={groups}
        selectedGroup={selectedGroup}
        lab={lab}
        onSelectGroup={setSelectedGroup}
        onSetLab={setLab}
      />
      <TimeTable groups={groups} slots={slots} onClick={tableClick} />
      <SlotSummary slots={slots} />
    </div>
  );
}

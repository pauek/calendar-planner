"use client";

import { actionGroupSetIntervals } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import { groupSlots, hour2str, slotsToIntervals } from "@/lib/dates";
import { GroupWithSlots } from "@/lib/db/groups";
import { equalSets, setToggleElement } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import IntervalSummary from "./IntervalSummary";
import SlotsEditorForm from "./SlotsEditorForm";
import TimeTable from "./TimeTable";

type ShownSlots = {
  group: number;
  slots: Set<string>;
};

type TimetableProps = {
  groups: GroupWithSlots[];
};
export default function SlotsEditor({ groups }: TimetableProps) {
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [lab, setLab] = useState<boolean>(false);
  const [slots, setSlots] = useState<ShownSlots>({
    slots: groupSlots(groups[0], false),
    group: 0,
  });

  useEffect(() => {
    setSlots({
      slots: groupSlots(groups[selectedGroup], lab),
      group: selectedGroup,
    });
  }, [groups, selectedGroup, lab]);

  const group = groups[selectedGroup];

  const tableClick = (day: string, hour: string) => {
    setSlots((prev) => ({
      group: prev.group,
      slots: setToggleElement(prev.slots, hour2str(day, hour)),
    }));
  };

  const areThereChanges = () =>
    group !== undefined &&
    !equalSets(groupSlots(groups[slots.group], lab), slots.slots);

  const saveChanges = async () => {
    const intervals = slotsToIntervals(slots.slots, lab);
    await actionGroupSetIntervals(group.id, lab, intervals);
    setSlots({ group: selectedGroup, slots: new Set() });
  };

  const revertChanges = async () => {
    setSlots({
      group: selectedGroup,
      slots: groupSlots(groups[selectedGroup], lab),
    });
  };

  return (
    <div className="pl-6 flex flex-col gap-3">
      <SlotsEditorForm
        groups={groups}
        selectedGroup={selectedGroup}
        lab={lab}
        onSelectGroup={setSelectedGroup}
        onSetLab={setLab}
      />
      <TimeTable groups={groups} lab={lab} slots={slots.slots} onClick={tableClick} />
      <div className="flex flex-row justify-between gap-2">
        <IntervalSummary intervals={slotsToIntervals(slots.slots, lab)} />
        {areThereChanges() && (
          <>
            <Button variant="ghost" title="Undo" onClick={revertChanges}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </>
        )}
      </div>
    </div>
  );
}

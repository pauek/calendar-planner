"use client";

import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

type GroupSelectorProps = {
  groups: string[];
  selected: number;
  lab: boolean;
  onGroupChange: (index: number) => void;
};
export default function GroupSelector({
  groups,
  selected,
  lab,
  onGroupChange,
}: GroupSelectorProps) {
  const handleButtonClick =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.preventDefault();
      onGroupChange(index);
    };

  return (
    <div className="flex items-center gap-1 border rounded-lg p-[2px] min-h-[2.5em]">
      {groups.map((group, index) => (
        <Button
          key={group}
          className={`rounded-md w-[3.6em] text-sm font-medium ${
            index === selected
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground"
          }`}
          onClick={handleButtonClick(index)}
          variant={index === selected ? "default" : "ghost"}
        >
          {lab ? "L" : "T"}
          {group}
        </Button>
      ))}
    </div>
  );
}

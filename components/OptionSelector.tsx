"use client";

import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

type GroupSelectorProps = {
  options: string[];
  selected: number;
  onSelect: (index: number) => void;
};
export default function OptionSelector({
  options,
  selected,
  onSelect,
}: GroupSelectorProps) {
  const handleButtonClick =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.preventDefault();
      onSelect(index);
    };

  return (
    <div className="flex items-center gap-1 border rounded-lg p-[2px] min-h-[2.5em]">
      {options.map((option, index) => (
        <Button
          key={option}
          className={`rounded-md w-[3.6em] text-sm font-medium ${
            index === selected
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground"
          }`}
          onClick={handleButtonClick(index)}
          variant={index === selected ? "default" : "ghost"}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

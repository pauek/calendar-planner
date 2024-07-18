"use client"

import { actionGroupSetIntervals } from "@/actions/groups"
import { Button } from "@/components/ui/button"
import { groupSlots, hour2str, slotsToIntervals } from "@/lib/dates"
import { CourseWithGroups, Exams } from "@/lib/db/courses"
import { equalSets, setToggleElement } from "@/lib/utils"
import { Undo2 } from "lucide-react"
import { useEffect, useState } from "react"
import IntervalSummary from "./IntervalSummary"
import SlotsEditorForm from "./SlotsEditorForm"
import TimeTable from "./TimeTable"
import { DatePicker } from "./DatePicker"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type ShownSlots = {
  group: number
  slots: Set<string>
}

type TimetableProps = {
  course: NonNullable<CourseWithGroups>
  exams: Exams
}
export default function SlotsEditor({ course, exams }: TimetableProps) {
  const { groups } = course
  const [selectedGroup, setSelectedGroup] = useState<number>(0)
  const [lab, setLab] = useState<boolean>(false)
  const [slots, setSlots] = useState<ShownSlots>({
    slots: groupSlots(groups[0], false),
    group: 0,
  })

  useEffect(() => {
    setSlots({
      slots: groupSlots(groups[selectedGroup], lab),
      group: selectedGroup,
    })
  }, [groups, selectedGroup, lab])

  const group = groups[selectedGroup]

  const tableClick = (day: string, hour: string) => {
    setSlots((prev) => ({
      group: prev.group,
      slots: setToggleElement(prev.slots, hour2str(day, hour)),
    }))
  }

  const areThereChanges = () =>
    group !== undefined && !equalSets(groupSlots(groups[slots.group], lab), slots.slots)

  const saveChanges = async () => {
    const intervals = slotsToIntervals(slots.slots, lab)
    await actionGroupSetIntervals(group.id, lab, intervals)
    setSlots({ group: selectedGroup, slots: new Set() })
  }

  const revertChanges = async () => {
    setSlots({
      group: selectedGroup,
      slots: groupSlots(groups[selectedGroup], lab),
    })
  }

  const SummaryTable = () => (
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
  )

  return (
    <div className="pt-6 flex flex-col gap-3">
      <SlotsEditorForm
        course={course}
        selectedGroup={selectedGroup}
        lab={lab}
        onSelectGroup={setSelectedGroup}
        onSetLab={setLab}
      />
      <Card>
        <CardHeader>
          <CardTitle>Horari</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeTable groups={groups} lab={lab} slots={slots.slots} onClick={tableClick} />
          <SummaryTable />
        </CardContent>
      </Card>
      <div className="flex flex-row items-center">
        <div className="mr-3 text-sm font-bold min-w-[10em]">Examen Parcial</div>
        <DatePicker initialDate={exams.partialExam} courseId={course.id} type="partial-exam" />
      </div>
      <div className="flex flex-row items-center">
        <div className="mr-3 text-sm font-bold min-w-[10em]">Examen Final</div>
        <DatePicker initialDate={exams.finalExam} courseId={course.id} type="final-exam" />
      </div>
    </div>
  )
}

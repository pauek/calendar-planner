"use client"

import { actionGroupAdd } from "@/actions/groups"
import OptionSelector from "@/components/OptionSelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CourseWithGroups } from "@/lib/db/courses"
import { useRef } from "react"

type SlotsEditorFormProps = {
  course: NonNullable<CourseWithGroups>
  lab: boolean
  selectedGroup: number
  onSelectGroup: (index: number) => void
  onSetLab: (checked: boolean) => void
}
export default function SlotsEditorForm({
  course,
  lab,
  selectedGroup,
  onSelectGroup,
  onSetLab,
}: SlotsEditorFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const addGroup = async (data: FormData) => {
    const groupField = data.get("group")
    if (!groupField) {
      throw new Error(`Missing 'group'!`)
    }
    await actionGroupAdd(course.id, groupField.valueOf() as string)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }
  return (
    <>
      <form action={addGroup} className="max-w-[18em] flex flex-row gap-2">
        <Input type="text" name="group" ref={inputRef} />
        <Button>Nou Grup</Button>
      </form>
      <div className="flex flex-row gap-2">
        <OptionSelector
          options={["T", "L"]}
          selected={lab ? 1 : 0}
          onSelect={(n) => onSetLab(n == 1)}
        />
        <OptionSelector
          options={course?.groups.map((g) => g.group)}
          selected={selectedGroup}
          onSelect={onSelectGroup}
        />
      </div>
    </>
  )
}

import { actionGroupAdd } from "@/actions/groups";
import GroupSelector from "@/components/GroupSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEMESTER, YEAR } from "@/lib/config";
import { GroupWithSlots } from "@/lib/db/groups";
import { Switch } from "@/components/ui/switch";

type SlotsEditorFormProps = {
  groups: GroupWithSlots[];
  lab: boolean;
  selectedGroup: number;
  onSelectGroup: (index: number) => void;
  onSetLab: (checked: boolean) => void;
};
export default function SlotsEditorForm({
  groups,
  lab,
  selectedGroup,
  onSelectGroup,
  onSetLab,
}: SlotsEditorFormProps) {
  const addGroup = async (data: FormData) => {
    const groupField = data.get("group");
    if (!groupField) {
      throw new Error(`Missing 'group'!`);
    }
    await actionGroupAdd(YEAR, SEMESTER, groupField.valueOf() as string);
  };
  return (
    <>
      <form action={addGroup} className="max-w-[18em] flex flex-row gap-2">
        <Input type="text" name="group" />
        <Button>Nou Grup</Button>
      </form>
      <GroupSelector
        groups={groups.map((g) => g.group)}
        selected={selectedGroup}
        lab={lab}
        onGroupChange={onSelectGroup}
      />
      <label className="flex flex-row items-center mr-8">
        <Switch checked={lab} onCheckedChange={onSetLab} />
        <span className="pl-2 select-none cursor-pointer">Laboratory</span>
      </label>
    </>
  );
}

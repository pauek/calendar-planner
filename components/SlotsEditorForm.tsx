import { actionGroupAdd } from "@/actions/groups";
import OptionSelector from "@/components/OptionSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEMESTER, YEAR } from "@/lib/config";
import { GroupWithSlots } from "@/lib/db/groups";

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
      <div className="flex flex-row gap-2">
        <OptionSelector
          options={groups.map((g) => g.group)}
          selected={selectedGroup}
          onSelect={onSelectGroup}
        />
        <OptionSelector
          options={["T", "L"]}
          selected={lab ? 1 : 0}
          onSelect={(n) => onSetLab(n == 1)}
        />
      </div>
    </>
  );
}

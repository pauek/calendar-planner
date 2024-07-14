import HolidaysEditor from "@/components/HolidaysEditor";
import SlotsEditor from "@/components/SlotsEditor";
import { SEMESTER, YEAR } from "@/lib/config";
import { dbGroupGetAllWithSlots } from "@/lib/db/groups";

export default async function Home() {
  const groups = await dbGroupGetAllWithSlots(YEAR, SEMESTER);

  return (
    <main className="p-6 flex flex-row">
      <HolidaysEditor />
      <div className="w-12"></div>
      <SlotsEditor groups={groups} />
    </main>
  );
}

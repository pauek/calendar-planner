import HolidayCalendar from "@/components/HolidayCalendar";
import Timetable from "@/components/Timetable";
import { semester, year } from "@/lib/config";
import { dbGetGroups } from "@/lib/db/groups";

export default async function Home() {
  const groups = await dbGetGroups(year, semester);

  return (
    <main className="p-6 flex flex-row">
      <HolidayCalendar />
      <div className="w-12"></div>
      <Timetable groups={groups} />
    </main>
  );
}

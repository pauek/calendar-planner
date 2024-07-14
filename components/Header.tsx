import Link from "next/link";

export default function Header() {
  return (
    <header className="h-12 shadow px-4 flex flex-row gap-4 items-center">
      <span className="font-bold text-xl">Calendar Planner</span>
      <div className="w-4"></div>
      <Link href="/holidays">Holidays</Link>
      <Link href="/timetable">Timetable</Link>
    </header>
  );
}

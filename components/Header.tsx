import Link from "next/link";

export default function Header() {
  return (
    <header className="h-12 shadow px-4 flex flex-row items-center">
      <span className="font-bold text-xl">Calendar Planner</span>
      <div className="w-12"></div>
      <Link href="/holidays">Holidays</Link>
    </header>
  );
}

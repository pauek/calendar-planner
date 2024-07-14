import Link from "next/link";

export default function Header() {
  return (
    <header className="h-12 shadow px-4 flex flex-row gap-4 items-center">
      <Link href="/" className="font-bold text-xl">Planificació del Calendari</Link>
      <div className="w-4"></div>
      <Link href="/edit">Configura</Link>
    </header>
  );
}

import { DBSemester } from "@/lib/db/semester"
import Link from "next/link"
import SemesterSelector from "./SemesterSelector"

type HeaderProps = {
  semesters: DBSemester[]
}
export default function Header({ semesters }: HeaderProps) {
  return (
    <header className="h-12 shadow px-4 flex flex-row gap-4 items-center">
      <Link href="/" className="font-bold text-xl">
        CalendarPlanner
      </Link>
      <div className="w-4"></div>
      <SemesterSelector semesters={semesters} />
    </header>
  )
}

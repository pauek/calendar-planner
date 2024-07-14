import MonthComponent from "@/components/MonthComponent";
import { Semester, semesterMonths } from "@/lib/dates";
import React from "react";

const year = 2024;
const semester: Semester = "autumn";

export default function Page() {
  return (
    <main className="p-6">
      <h1>Holidays</h1>
      {semesterMonths[semester].map((m) => (
        <MonthComponent
          key={`${year}-${m.month}`}
          year={year}
          semester={semester}
          semesterStart={new Date(Date.UTC(2024, 8, 9))}
          month={m}
        />
      ))}
    </main>
  );
}

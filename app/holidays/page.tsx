import MonthComponent from "@/components/MonthComponent";
import { dateonly, Semester, semesterMonths } from "@/lib/dates";
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
          semesterStart={{ year: 2024, month: 9, day: 9 }}
          month={m}
        />
      ))}
    </main>
  );
}

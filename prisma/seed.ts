import { PERIOD, YEAR } from "@/lib/config"
import { db } from "@/lib/db/db"

await db.semesterType.createMany({
  data: [{ period: "autumn" }, { period: "spring" }],
})

await db.semester.createMany({
  data: [
    { year: 2023, period: "autumn" },
    { year: 2024, period: "spring" },
    { year: 2024, period: "autumn" },
    { year: 2025, period: "spring" },
  ],
})

await db.course.create({
  data: {
    name: "PRO1",
    semester: {
      connect: {
        year_period: { year: YEAR, period: PERIOD },
      },
    },
  },
})

await db.$disconnect()
process.exit(0)

import { db } from "@/lib/db/db";

await db.semesterType.createMany({
  data: [{ type: "autumn" }, { type: "spring" }],
});

await db.$disconnect();
process.exit(0);
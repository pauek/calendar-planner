import SpecialDaysEditor from "@/components/SpecialDaysEditor";
import SlotsEditor from "@/components/SlotsEditor";
import { dbCourseGetById } from "@/lib/db/courses";
import { dbSemesterGet } from "@/lib/db/semester";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    courseId: string
  }
}
export default async function Home({ params }: PageProps) {
  const courseId = Number(params.courseId);
  if (Number.isNaN(courseId)) {
    notFound();
  }
  const course = await dbCourseGetById(courseId);
  if (course === null) {
    notFound();
  }

  const semester = await dbSemesterGet(course.year, course.semester);
  if (semester === null) {
    throw new Error(`Expected to find semester for course ${courseId}`)
  }

  return (
    <main className="p-6 flex flex-row">
      <SpecialDaysEditor semester={semester} />
      <div className="w-12"></div>
      <SlotsEditor course={course} />
    </main>
  );
}

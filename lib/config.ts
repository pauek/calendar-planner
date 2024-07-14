import { date2altdate, AltDate, Semester } from "./dates";

export const year = 2024;
export const semester: Semester = "autumn";
export const startDate: AltDate = { year, month: 9, day: 2 };
export const endDate: AltDate = { year: year + 1, month: 1, day: 27 };

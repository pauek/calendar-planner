import { AltDate, Semester } from "./dates";

export const YEAR = 2024;
export const SEMESTER: Semester = "autumn";
export const START_DATE: AltDate = { year: YEAR, month: 9, day: 2 };
export const END_DATE: AltDate = { year: YEAR + 1, month: 1, day: 27 };

export const SLOT_WIDTH = 10; // em
export const SLOT_MARGIN = 0.2; // em
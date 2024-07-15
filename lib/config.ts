import { altDate, AltDate, mkMonth, Semester, SemesterMonth } from "./dates"

export const YEAR = 2024
export const SEMESTER: Semester = "autumn"

export const SEMESTER_BEGIN: AltDate = { year: YEAR, month: 9, day: 9 }
export const SEMESTER_END: AltDate = { year: YEAR + 1, month: 1, day: 20 }

export const CLASSES_BEGIN: AltDate = { year: YEAR, month: 9, day: 9 }
export const CLASSES_END: AltDate = { year: YEAR, month: 12, day: 21 }

export const SLOT_HEIGHT = 2 // em
export const SLOT_WIDTH = 7 // em
export const SLOT_MARGIN = 0.2 // em


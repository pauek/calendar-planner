import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const titleize = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`

export const setToggleElement = <T>(set: Set<T>, elem: T) => {
  const result = new Set(set)
  if (result.has(elem)) {
    result.delete(elem)
  } else {
    result.add(elem)
  }
  return result
}

export const setDifference = <T>(a: Set<T>, b: Set<T>) => {
  const result: Set<T> = new Set<T>()
  for (const elem of a) {
    if (!b.has(elem)) {
      result.add(elem)
    }
  }
  return result
}

export const equalSets = <T>(a: Set<T>, b: Set<T>) => {
  try {
    const d1 = setDifference(a, b)
    const d2 = setDifference(b, a)
    return d1.size == 0 && d2.size == 0
  } catch (e) {
    console.log(a, b)
    console.error(e)
  }
}

export const makeArray = <T>({ length, elemFn }: { length: number; elemFn?: () => T }) =>
  Array.from({ length }).map((_) => elemFn && elemFn()) as T[]

export function transpose<T>(matrix: T[][]): T[][] {
  const rows = matrix.length
  const cols = matrix.reduce((acc, row) => Math.max(acc, row.length), 0)
  const result: T[][] = makeArray<T[]>({ length: cols, elemFn: () => [] })
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      result[i][j] = matrix[j][i]
    }
  }
  return result
}

const rCoursePath = /^\/courses\/(\d+)\/.*$/
export const getCourseIdFromPathname = (path: string) => {
  const match = path.match(rCoursePath)
  if (match != null) {
    return Number(match[1])
  } else {
    return null
  }
}

export const groupsOf = <T>(n: number, array: T[]) => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += n) {
    const tuple: T[] = []
    for (let j = 0; j < n; j++) {
      tuple.push(array[i + j])
    }
    result.push(tuple)
  }
  return result
}

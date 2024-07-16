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

export const equalSets = <T>(a: Set<T>, b: Set<T>) => {
  const d1 = a.difference(b)
  const d2 = b.difference(a)
  return d1.size == 0 && d2.size == 0
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

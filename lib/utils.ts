import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const titleize = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`;

export const setToggleElement = <T> (set: Set<T>, elem: T) => {
  const result = new Set(set);
  if (result.has(elem)) {
    result.delete(elem);
  } else {
    result.add(elem);
  }
  return result;
};
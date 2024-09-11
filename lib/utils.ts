import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractChangedValues<T extends Record<string, any | any[]>>(
  original: T,
  updatedObject: Partial<T>,
  ignoreArrays = true,
): Partial<T> {
  const result: Partial<T> = {};
  Object.entries(updatedObject).forEach(([key, value]) => {
    if (Array.isArray(value) && !ignoreArrays) {
      result[key as keyof T] = value as any;
    } else if (
      typeof value !== "object" &&
      key in original &&
      value !== original[key as keyof T]
    ) {
      result[key as keyof T] = value;
    }
  });
  return result;
}

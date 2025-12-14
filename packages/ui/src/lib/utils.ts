import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a CSS variable for use in styles
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Format an HSL CSS variable for use in color values
 */
export function hslVar(name: string): string {
  return `hsl(var(--${name}))`;
}

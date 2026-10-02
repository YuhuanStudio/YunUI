/* Copied from reference/beautiful-ui/lib/utils.ts (MIT),
 * commit 44a274e598395ab61e7c96c26fda2758780253b7. */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names, letting later Tailwind classes win over conflicting earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

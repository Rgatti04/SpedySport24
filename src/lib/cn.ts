import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Compone classi condizionali (clsx) risolvendo i conflitti Tailwind (tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

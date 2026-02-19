import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', options);
}

export function formatCurrency(amount: number | string) {
  return `${amount} MAD`;
}

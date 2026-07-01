import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getText = (name: any) => {
  return name.length ?? 0;
};

export function getTitle(title: string) {
  return { title };
}

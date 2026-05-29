import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')          
    .replace(/[^\w\-]+/g, '')     
    .replace(/\-\-+/g, '-')        
    .replace(/^-+/, '')            
    .replace(/-+$/, '');           
}

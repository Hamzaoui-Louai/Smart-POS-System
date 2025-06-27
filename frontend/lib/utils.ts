import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function setUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pharmasphere_user', JSON.stringify(user));
  }
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('pharmasphere_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pharmasphere_user');
  }
}

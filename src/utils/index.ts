import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AITool } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateExpirationDate(purchaseDate: string, feeType: 'monthly' | 'yearly'): string {
  const date = new Date(purchaseDate);
  if (feeType === 'yearly') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().split('T')[0];
}

export function isExpiringSoon(expirationDate: string, daysThreshold: number = 7): boolean {
  const expiry = new Date(expirationDate);
  const today = new Date();
  const timeDiff = expiry.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff <= daysThreshold && daysDiff >= 0;
}

export function isExpired(expirationDate: string): boolean {
  const expiry = new Date(expirationDate);
  const today = new Date();
  return expiry < today;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const expiry = new Date(expirationDate);
  const today = new Date();
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

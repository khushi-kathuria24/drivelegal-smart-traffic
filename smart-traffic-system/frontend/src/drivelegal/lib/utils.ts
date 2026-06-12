import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getRiskLevel(score: number): {
  label: string
  color: string
  bgColor: string
  textColor: string
} {
  if (score >= 80)
    return {
      label: 'Critical',
      color: 'danger',
      bgColor: 'bg-danger-100 dark:bg-danger-900',
      textColor: 'text-danger-800 dark:text-danger-200',
    }
  if (score >= 60)
    return {
      label: 'High',
      color: 'warning',
      bgColor: 'bg-warning-100 dark:bg-warning-900',
      textColor: 'text-warning-800 dark:text-warning-200',
    }
  if (score >= 40)
    return {
      label: 'Medium',
      color: 'primary',
      bgColor: 'bg-primary-100 dark:bg-primary-900',
      textColor: 'text-primary-800 dark:text-primary-200',
    }
  return {
    label: 'Low',
    color: 'success',
    bgColor: 'bg-success-100 dark:bg-success-900',
    textColor: 'text-success-800 dark:text-success-200',
  }
}

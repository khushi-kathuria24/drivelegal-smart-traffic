'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'neutral'
  className?: string
}

const variantStyles = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  primary: 'badge-primary',
  neutral: 'badge bg-dark-200 text-dark-800 dark:bg-dark-700 dark:text-dark-200',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn(variantStyles[variant], className)}>
      {children}
    </span>
  )
}

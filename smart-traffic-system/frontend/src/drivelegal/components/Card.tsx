'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  interactive?: boolean
  elevated?: boolean
}

export function Card({
  children,
  interactive = false,
  elevated = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        interactive && 'card-hover',
        elevated && 'shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  title?: string
  subtitle?: string
}

export function CardHeader({
  children,
  title,
  subtitle,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn('mb-4 border-b border-dark-200 pb-4 dark:border-dark-700', className)} {...props}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {subtitle && <p className="text-sm text-dark-600 dark:text-dark-400">{subtitle}</p>}
      {children}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between border-t border-dark-200 pt-4 dark:border-dark-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

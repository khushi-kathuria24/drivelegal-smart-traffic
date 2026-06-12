'use client'

import React, { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
  isDark: boolean
  onToggleDark: () => void
  onNavigate?: (href: string) => void
  onLogout?: () => void
  currentPath?: string
}

export function AppLayout({ children, isDark, onToggleDark, onNavigate, onLogout, currentPath }: LayoutProps) {
  const location = useLocation()
  const pathname = currentPath || location.pathname

  return (
    <div className={cn('flex h-screen w-screen bg-dark-50 dark:bg-dark-900', isDark && 'dark')}>
      <Sidebar currentPath={pathname} onNavigate={onNavigate} />

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header isDark={isDark} onToggleDark={onToggleDark} onLogout={onLogout} />

        <main className="flex-1 w-full overflow-y-scroll">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { AppLayout } from '@/layouts/AppLayout'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

export function AppProvider({ 
  children,
  onNavigate,
  onLogout,
  currentPath
}: { 
  children: React.ReactNode;
  onNavigate?: (href: string) => void;
  onLogout?: () => void;
  currentPath?: string;
}) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const theme = saved || 'light'
    setIsDark(theme === 'dark')
  }, [])

  const handleToggleDark = () => {
    const newTheme = !isDark ? 'dark' : 'light'
    setIsDark(!isDark)
    localStorage.setItem('theme', newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <AppLayout 
      isDark={isDark} 
      onToggleDark={handleToggleDark} 
      onNavigate={onNavigate} 
      onLogout={onLogout}
      currentPath={currentPath}
    >
      {children}
      <ServiceWorkerRegistration />
    </AppLayout>
  )
}

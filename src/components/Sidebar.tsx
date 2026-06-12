'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  Calculator,
  BookOpen,
  BarChart3,
  AlertCircle,
  MapPin,
  ShieldAlert,
  FileText,
  Users,
  Settings,
  HardDrive,
  Clock,
  Radio,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'AI Legal Assistant', href: '/assistant', icon: MessageSquare },
  { name: 'Challan Calculator', href: '/calculator', icon: Calculator },
  { name: 'State Laws', href: '/laws', icon: BookOpen },
  { name: 'Violation Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Live Alerts', href: '/alerts', icon: AlertCircle },
  { name: 'Geo-Zones', href: '/geo-zones', icon: MapPin },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Police Portal', href: '/police-portal', icon: Users },
  { name: 'Offline Sync', href: '/sync', icon: HardDrive },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  currentPath: string
}

export function Sidebar({ currentPath }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-primary-600 p-2 text-white lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform bg-white px-4 py-6 shadow-lg transition-transform duration-200 dark:bg-dark-800 lg:relative lg:translate-x-0 lg:shadow-none',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
            <span className="text-lg font-bold text-white">DL</span>
          </div>
          <span className="hidden text-lg font-bold sm:inline">DriveLegal</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-700 hover:bg-dark-100 dark:text-dark-300 dark:hover:bg-dark-700'
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-6 left-4 right-4 rounded-lg bg-primary-50 p-3 dark:bg-dark-700">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">
            PRO VERSION
          </p>
          <p className="mt-1 text-xs text-dark-600 dark:text-dark-400">
            All features unlocked
          </p>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

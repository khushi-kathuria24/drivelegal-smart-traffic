'use client'

import React, { useState } from 'react'
import {
  Bell,
  Globe,
  Search,
  MapPin,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/mockData'

interface HeaderProps {
  isDark: boolean
  onToggleDark: () => void
  onLogout?: () => void
}

export function Header({ isDark, onToggleDark, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-dark-200 bg-white shadow-sm dark:border-dark-700 dark:bg-dark-800">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="hidden flex-1 sm:flex sm:items-center sm:gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search laws, violations..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Location selector */}
          <button className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-dark-100 dark:hover:bg-dark-700 sm:flex">
            <MapPin size={16} className="text-primary-600" />
            <span className="hidden text-dark-600 dark:text-dark-400 md:inline">
              Karnataka
            </span>
          </button>

          {/* Language selector */}
          <button className="rounded-lg px-3 py-2 text-sm hover:bg-dark-100 dark:hover:bg-dark-700">
            <Globe size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            className="rounded-lg p-2 hover:bg-dark-100 dark:hover:bg-dark-700"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 hover:bg-dark-100 dark:hover:bg-dark-700"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-600" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-dark-200 bg-white shadow-lg dark:border-dark-700 dark:bg-dark-800">
                <div className="border-b border-dark-200 p-4 dark:border-dark-700">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 space-y-2 divide-y divide-dark-200 overflow-y-auto dark:divide-dark-700">
                  {[
                    {
                      title: 'Challan Pending',
                      desc: 'Fine of ₹800 for traffic signal violation',
                      time: '2 hours ago',
                    },
                    {
                      title: 'Enforcement Zone Alert',
                      desc: 'Active enforcement near Silk Board Junction',
                      time: '1 hour ago',
                    },
                    {
                      title: 'Document Expiring',
                      desc: 'Pollution certificate expires in 8 days',
                      time: '3 hours ago',
                    },
                  ].map((notif, i) => (
                    <div key={i} className="p-3 hover:bg-dark-50 dark:hover:bg-dark-700">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-dark-600 dark:text-dark-400">{notif.desc}</p>
                      <p className="mt-1 text-xs text-dark-500">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-dark-100 dark:hover:bg-dark-700"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden text-sm font-medium sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-dark-200 bg-white shadow-lg dark:border-dark-700 dark:bg-dark-800">
                <div className="border-b border-dark-200 p-4 dark:border-dark-700">
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    {currentUser.email}
                  </p>
                </div>
                <div className="space-y-2 p-2">
                  <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-dark-100 dark:hover:bg-dark-700">
                    <User size={14} />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-dark-100 dark:hover:bg-dark-700">
                    <Settings size={14} />
                    Settings
                  </button>
                  <button 
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-dark-700"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

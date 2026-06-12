'use client'

import React, { useState } from 'react'
import { Settings, Globe, Bell, Lock, Zap, HelpCircle, LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { currentUser } from '@/lib/mockData'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Manage your account, preferences, and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar Menu */}
        <div className="space-y-1 lg:col-span-1">
          {[
            { id: 'account', name: 'Account', icon: '👤' },
            { id: 'notifications', name: 'Notifications', icon: '🔔' },
            { id: 'privacy', name: 'Privacy & Security', icon: '🔒' },
            { id: 'preferences', name: 'Preferences', icon: '⚙️' },
            { id: 'help', name: 'Help & Support', icon: '❓' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full rounded-lg px-4 py-2.5 text-left font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'hover:bg-dark-100 dark:hover:bg-dark-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <>
              <Card>
                <CardHeader title="Profile Information" />
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={currentUser.email}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      defaultValue={currentUser.location}
                      className="input"
                    />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Account Status" />
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Account Type</span>
                      <Badge variant="primary">Premium Pro</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Member Since</span>
                      <span className="font-medium">January 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verification Status</span>
                      <Badge variant="success">Verified</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" />
              <CardContent className="space-y-4">
                {[
                  { name: 'Email Notifications', description: 'Receive alerts via email' },
                  { name: 'SMS Alerts', description: 'Important alerts sent as SMS' },
                  { name: 'Push Notifications', description: 'App notifications' },
                  { name: 'Weekly Summary', description: 'Weekly traffic statistics' },
                  { name: 'Document Reminders', description: 'Document expiry alerts' },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-dark-200 dark:border-dark-700 last:border-0">
                    <div>
                      <p className="font-medium">{notif.name}</p>
                      <p className="text-xs text-dark-600 dark:text-dark-400">
                        {notif.description}
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <>
              <Card>
                <CardHeader title="Password & Authentication" />
                <CardContent className="space-y-4">
                  <Button variant="secondary" className="w-full justify-start">
                    <Lock size={16} />
                    Change Password
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Zap size={16} />
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Data & Privacy" />
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Your data is encrypted and stored securely. Learn about our privacy policy.
                  </p>
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start">
                      Download My Data
                    </Button>
                    <Button variant="secondary" className="w-full justify-start">
                      Request Data Deletion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader title="App Preferences" />
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="input">
                    <option>English</option>
                    <option>हिंदी</option>
                    <option>ಕನ್ನಡ</option>
                    <option>मराठी</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select className="input">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Default State</label>
                  <select className="input">
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                  </select>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {/* Help & Support */}
          {activeTab === 'help' && (
            <>
              <Card>
                <CardHeader title="Getting Help" />
                <CardContent className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start">
                    <HelpCircle size={16} />
                    View Documentation
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    Report a Bug
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Danger Zone" />
                <CardContent className="space-y-3">
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    These actions are irreversible. Proceed with caution.
                  </p>
                  <Button
                    variant="danger"
                    className="w-full justify-start"
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

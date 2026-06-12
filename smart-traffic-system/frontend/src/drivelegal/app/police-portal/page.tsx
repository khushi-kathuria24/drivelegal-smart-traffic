'use client'

import React, { useState } from 'react'
import { Users, Search, Filter, Download, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { violations, challans } from '@/lib/mockData'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function PolicePortalPage() {
  const [selectedTab, setSelectedTab] = useState('violations')
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Police & Admin Portal</h1>
          <p className="mt-1 text-dark-600 dark:text-dark-400">
            Enforcement management and violation processing
          </p>
        </div>
        <Badge variant="primary">ADMIN</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Total Violations</p>
            <p className="mt-2 text-3xl font-bold">1,234</p>
            <p className="mt-1 text-xs text-primary-600">This month</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Pending Challans</p>
            <p className="mt-2 text-3xl font-bold">234</p>
            <p className="mt-1 text-xs text-warning-600">Awaiting payment</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Total Fines Collected</p>
            <p className="mt-2 text-2xl font-bold">₹45.2L</p>
            <p className="mt-1 text-xs text-success-600">This month</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Active Officers</p>
            <p className="mt-2 text-3xl font-bold">48</p>
            <p className="mt-1 text-xs text-primary-600">On duty</p>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="flex gap-2 border-b border-dark-200 dark:border-dark-700">
          {['violations', 'challans', 'appeals', 'officers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-medium transition-all ${
                selectedTab === tab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-dark-600 dark:text-dark-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search by registration, officer, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <Button variant="secondary" icon={<Filter size={14} />}>
            Filters
          </Button>
          <Button variant="secondary" icon={<Download size={14} />}>
            Export
          </Button>
        </CardContent>
      </Card>

      {/* Violations Table */}
      {selectedTab === 'violations' && (
        <Card>
          <CardHeader title="Recent Violations" subtitle="Processing and enforcement records" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-200 dark:border-dark-700">
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Location</th>
                    <th className="px-4 py-3 text-left font-semibold">Officer</th>
                    <th className="px-4 py-3 text-left font-semibold">Fine Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-dark-200 hover:bg-dark-50 dark:border-dark-700 dark:hover:bg-dark-700"
                    >
                      <td className="px-4 py-3 font-medium">{v.type}</td>
                      <td className="px-4 py-3 text-dark-600 dark:text-dark-400">
                        {v.location}
                      </td>
                      <td className="px-4 py-3">{v.officer || '-'}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(v.fineAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            v.status === 'resolved'
                              ? 'success'
                              : v.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{formatDate(v.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="rounded p-1 hover:bg-dark-200 dark:hover:bg-dark-600">
                            <CheckCircle size={14} className="text-success-600" />
                          </button>
                          <button className="rounded p-1 hover:bg-dark-200 dark:hover:bg-dark-600">
                            <Trash2 size={14} className="text-danger-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challans Table */}
      {selectedTab === 'challans' && (
        <Card>
          <CardHeader title="Challan Records" subtitle="Issued challans and payment status" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-200 dark:border-dark-700">
                    <th className="px-4 py-3 text-left font-semibold">Challan ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Citizen</th>
                    <th className="px-4 py-3 text-left font-semibold">Registration</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Issued</th>
                    <th className="px-4 py-3 text-left font-semibold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {challans.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-dark-200 hover:bg-dark-50 dark:border-dark-700 dark:hover:bg-dark-700"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-3">{c.citizenName}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {c.registrationNumber}
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(c.totalFine)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            c.status === 'paid'
                              ? 'success'
                              : c.status === 'pending'
                              ? 'primary'
                              : 'danger'
                          }
                        >
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{formatDate(c.issuedDate)}</td>
                      <td className="px-4 py-3">{formatDate(c.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appeals */}
      {selectedTab === 'appeals' && (
        <Card>
          <CardHeader title="Violation Appeals" subtitle="Pending and resolved appeals" />
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 'appeal_001',
                  challan: 'CHAL-001',
                  reason: 'Wrong vehicle identified',
                  status: 'pending',
                },
                {
                  id: 'appeal_002',
                  challan: 'CHAL-002',
                  reason: 'Faulty speed detection',
                  status: 'approved',
                },
              ].map((appeal) => (
                <div
                  key={appeal.id}
                  className="flex items-center justify-between rounded-lg border border-dark-200 p-4 dark:border-dark-700"
                >
                  <div>
                    <p className="font-medium">{appeal.challan}</p>
                    <p className="text-xs text-dark-600 dark:text-dark-400">
                      {appeal.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={appeal.status === 'approved' ? 'success' : 'warning'}
                    >
                      {appeal.status}
                    </Badge>
                    <Button size="sm" variant="secondary">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Officers */}
      {selectedTab === 'officers' && (
        <Card>
          <CardHeader title="Enforcement Officers" subtitle="Active officers and their performance" />
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Officer Sharma', id: 'OFC-001', violations: 145, rating: 4.8 },
                { name: 'Officer Patel', id: 'OFC-002', violations: 128, rating: 4.5 },
                { name: 'Officer Singh', id: 'OFC-003', violations: 156, rating: 4.9 },
                { name: 'Officer Kumar', id: 'OFC-004', violations: 112, rating: 4.3 },
              ].map((officer) => (
                <div
                  key={officer.id}
                  className="rounded-lg border border-dark-200 p-4 dark:border-dark-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{officer.name}</p>
                      <p className="text-xs text-dark-600 dark:text-dark-400">{officer.id}</p>
                    </div>
                    <Badge variant="primary">Active</Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p>Violations: <span className="font-semibold">{officer.violations}</span></p>
                    <p>Rating: <span className="font-semibold">{officer.rating}⭐</span></p>
                  </div>
                  <Button size="sm" variant="secondary" className="mt-3 w-full">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

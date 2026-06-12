'use client'

import React, { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { Download, Filter, TrendingUp } from 'lucide-react'
import { analyticsData } from '@/lib/mockData'
import { formatNumber } from '@/lib/utils'

const violationTypes = [
  { name: 'Speeding', value: 4200, color: '#EF4444' },
  { name: 'Helmet Violation', value: 3100, color: '#F59E0B' },
  { name: 'Traffic Signal', value: 2800, color: '#3B82F6' },
  { name: 'Parking', value: 2400, color: '#22C55E' },
  { name: 'Others', value: 2734, color: '#8B5CF6' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  // const [selectedViolation, setSelectedViolation] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">
            Violation Analytics
          </h1>
          <p className="mt-1 max-w-2xl text-dark-700 dark:text-dark-300">
            Track traffic violations and enforcement trends
          </p>
        </div>
        <Button icon={<Download size={16} />}>Export Report</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-primary-100 bg-gradient-to-br from-white via-blue-50/70 to-white dark:border-dark-700 dark:from-dark-800 dark:via-dark-800 dark:to-dark-700">
          <div>
            <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Total Violations</p>
            <p className="mt-2 text-3xl font-bold text-dark-900 dark:text-white">
              {formatNumber(analyticsData.totalViolations)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-danger-600 dark:text-danger-400">
              <TrendingUp size={12} /> +12% from last month
            </p>
          </div>
        </Card>

        <Card className="border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-white dark:border-dark-700 dark:from-dark-800 dark:via-dark-800 dark:to-dark-700">
          <div>
            <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Average Fine</p>
            <p className="mt-2 text-3xl font-bold text-dark-900 dark:text-white">
              ₹{formatNumber(analyticsData.avgFineAmount)}
            </p>
            <p className="mt-1 text-xs text-dark-600 dark:text-dark-400">Per violation</p>
          </div>
        </Card>

        <Card className="border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-white dark:border-dark-700 dark:from-dark-800 dark:via-dark-800 dark:to-dark-700">
          <div>
            <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Compliance Rate</p>
            <p className="mt-2 text-3xl font-bold text-dark-900 dark:text-white">
              {analyticsData.complianceRate}%
            </p>
            <p className="mt-1 text-xs text-success-600 dark:text-success-400">Citizens compliance</p>
          </div>
        </Card>

        <Card className="border border-amber-100 bg-gradient-to-br from-white via-amber-50/70 to-white dark:border-dark-700 dark:from-dark-800 dark:via-dark-800 dark:to-dark-700">
          <div>
            <p className="text-sm font-medium text-dark-700 dark:text-dark-300">Enforcement Zones</p>
            <p className="mt-2 text-3xl font-bold text-dark-900 dark:text-white">
              {analyticsData.enforcementZones}
            </p>
            <p className="mt-1 text-xs text-primary-600 dark:text-primary-300">Active zones</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-primary-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
        <CardContent className="flex flex-wrap gap-2">
          {['7d', '30d', '90d', 'ytd'].map((range) => (
            <Button
              key={range}
              onClick={() => setDateRange(range)}
              variant={dateRange === range ? 'primary' : 'secondary'}
              size="sm"
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'Year'}
            </Button>
          ))}
          <Button variant="secondary" size="sm" icon={<Filter size={14} />}>
            More Filters
          </Button>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trends Chart */}
        <Card className="border border-primary-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
          <CardHeader
            title="Violation Trends"
            subtitle="Weekly violation patterns"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="violations"
                  stroke="#2563eb"
                  name="Violations"
                />
                <Line
                  type="monotone"
                  dataKey="accidents"
                  stroke="#ef4444"
                  name="Accidents"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fine Amount Chart */}
        <Card className="border border-emerald-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
          <CardHeader
            title="Fine Collection"
            subtitle="Weekly fine amounts"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fines" fill="#22c55e" name="Fines (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Violation Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-violet-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
          <CardHeader
            title="Violation Types Distribution"
            subtitle="Breakdown by type"
          />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Violation List */}
        <Card className="border border-sky-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
          <CardHeader
            title="Top Violation Types"
            subtitle="Most common violations"
          />
          <CardContent>
            <div className="space-y-3">
              {violationTypes.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-dark-50 dark:hover:bg-dark-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: v.color }}
                    />
                    <span className="font-medium">{v.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(v.value)}</p>
                    <p className="text-xs text-dark-600 dark:text-dark-400">
                      {((v.value / analyticsData.totalViolations) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Risk Areas */}
      <Card className="border border-primary-100 bg-white/95 shadow-elevation dark:border-dark-700 dark:bg-dark-800">
        <CardHeader
          title="High-Risk Enforcement Zones"
          subtitle="Areas with most violations and accidents"
        />
        <CardContent>
          <div className="space-y-2">
            {[
              { name: 'Silk Board Junction', violations: 234, accidents: 12, risk: 'critical' },
              { name: 'Outer Ring Road - Section A', violations: 189, accidents: 8, risk: 'high' },
              { name: 'Brigade Road', violations: 156, accidents: 6, risk: 'high' },
              { name: 'Whitefield Highway', violations: 142, accidents: 9, risk: 'high' },
              { name: 'Koramangala Junction', violations: 128, accidents: 5, risk: 'medium' },
            ].map((zone, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-dark-200 p-4 dark:border-dark-700"
              >
                <div>
                  <p className="font-semibold">{zone.name}</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">
                    {zone.violations} violations • {zone.accidents} accidents
                  </p>
                </div>
                <Badge
                  variant={
                    zone.risk === 'critical'
                      ? 'danger'
                      : zone.risk === 'high'
                      ? 'warning'
                      : 'primary'
                  }
                >
                  {zone.risk.charAt(0).toUpperCase() + zone.risk.slice(1)} Risk
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

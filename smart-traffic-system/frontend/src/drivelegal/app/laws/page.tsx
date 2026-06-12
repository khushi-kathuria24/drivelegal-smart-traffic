'use client'

import React, { useState } from 'react'
import { Search, BookOpen, MapPin, Filter, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { trafficLaws, states } from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

export default function LawsDatabasePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('Karnataka')
  const [expandedLaw, setExpandedLaw] = useState<string | null>(null)

  const filteredLaws = trafficLaws.filter(
    (law) =>
      law.state === selectedState &&
      (law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        law.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        law.violationType.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">State Laws Database</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Browse and compare traffic regulations across states
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search by law title, violation type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input"
              >
                {states.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="secondary" size="sm" icon={<Filter size={14} />}>
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Laws List */}
      <div className="space-y-3">
        {filteredLaws.map((law) => (
          <Card key={law.id} interactive>
            <button
              onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{law.title}</h3>
                    <Badge variant="primary">{law.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">
                    {law.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-dark-100 px-2.5 py-1 text-xs font-medium dark:bg-dark-700">
                      {law.violationType}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-danger-100 px-2.5 py-1 text-xs font-medium text-danger-700 dark:bg-danger-900 dark:text-danger-200">
                      {formatCurrency(law.fineAmount)}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className="mt-1 transition-transform"
                  size={20}
                  style={{
                    transform:
                      expandedLaw === law.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
            </button>

            {expandedLaw === law.id && (
              <div className="mt-4 border-t border-dark-200 pt-4 dark:border-dark-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-dark-600 dark:text-dark-400">Source</p>
                    <p className="mt-1 font-medium">{law.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 dark:text-dark-400">Amendment Date</p>
                    <p className="mt-1 font-medium">{law.amendmentDate || 'Original'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 dark:text-dark-400">Applicable Vehicles</p>
                    <p className="mt-1 font-medium">
                      {law.applicableVehicles.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 dark:text-dark-400">Related Sections</p>
                    <p className="mt-1 font-medium">
                      {law.relatedSections?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm">
                    <BookOpen size={14} />
                    View Full Text
                  </Button>
                  <Button variant="ghost" size="sm">
                    Compare States
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredLaws.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-dark-600 dark:text-dark-400">No laws found matching your search</p>
              <Button onClick={() => setSearchTerm('')} variant="secondary" className="mt-4">
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comparison Section */}
      <Card>
        <CardHeader
          title="State Law Comparison"
          subtitle="Compare the same violation across different states"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-200 dark:border-dark-700">
                  <th className="px-4 py-2 text-left font-semibold">Violation</th>
                  <th className="px-4 py-2 text-left font-semibold">Karnataka</th>
                  <th className="px-4 py-2 text-left font-semibold">Maharashtra</th>
                  <th className="px-4 py-2 text-left font-semibold">Delhi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-200 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700">
                  <td className="px-4 py-3 font-medium">Speeding</td>
                  <td className="px-4 py-3">₹500</td>
                  <td className="px-4 py-3">₹600</td>
                  <td className="px-4 py-3">₹700</td>
                </tr>
                <tr className="border-b border-dark-200 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700">
                  <td className="px-4 py-3 font-medium">Helmet Violation</td>
                  <td className="px-4 py-3">₹100</td>
                  <td className="px-4 py-3">₹150</td>
                  <td className="px-4 py-3">₹200</td>
                </tr>
                <tr className="border-b border-dark-200 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700">
                  <td className="px-4 py-3 font-medium">Traffic Signal</td>
                  <td className="px-4 py-3">₹800</td>
                  <td className="px-4 py-3">₹900</td>
                  <td className="px-4 py-3">₹1000</td>
                </tr>
                <tr className="hover:bg-dark-50 dark:hover:bg-dark-700">
                  <td className="px-4 py-3 font-medium">No Insurance</td>
                  <td className="px-4 py-3">₹2000</td>
                  <td className="px-4 py-3">₹2500</td>
                  <td className="px-4 py-3">₹3000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

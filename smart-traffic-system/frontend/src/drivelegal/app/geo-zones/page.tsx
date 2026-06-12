'use client'

import React from 'react'
import { MapPin, AlertCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { geoZones } from '@/lib/geo-rules'

export default function GeoZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Geo-Fenced Enforcement Zones</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Real-time alerts for enforcement zones and speed-restricted areas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Active Zones</p>
            <p className="mt-2 text-3xl font-bold">{geoZones.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Nearby Zones</p>
            <p className="mt-2 text-3xl font-bold">7</p>
            <p className="mt-1 text-xs text-primary-600">Within 5 km</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">High Risk Areas</p>
            <p className="mt-2 text-3xl font-bold">3</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Nearby Enforcement Zones" />
        <CardContent>
          <div className="space-y-3">
            {geoZones.map((zone, i) => (
              <div key={i} className="rounded-lg border border-dark-200 p-4 dark:border-dark-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin size={16} className="text-primary-600" />
                      {zone.name}
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-dark-600 dark:text-dark-400">
                      <p>Speed Limit: {zone.speedLimit}</p>
                      <p>{zone.description}</p>
                    </div>
                  </div>
                  <Badge variant="warning">{zone.type}</Badge>
                </div>
                <p className="mt-3 text-xs text-dark-500 dark:text-dark-400">
                  Calculator impact: {zone.type === 'School Zone' ? 'up to 2x on speeding' : `${zone.fineMultiplier}x on relevant violations`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="How this connects to challans" />
        <CardContent>
          <p className="text-sm text-dark-700 dark:text-dark-300">
            The geo-zone list now feeds the challan calculator. If a user is in a School Zone,
            the calculator applies a stricter fine multiplier for matching violations like speeding.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

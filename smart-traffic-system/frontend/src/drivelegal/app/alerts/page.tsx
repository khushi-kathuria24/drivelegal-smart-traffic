'use client'

import React from 'react'
import { AlertCircle, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { trafficAlerts } from '@/lib/mockData'

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Traffic Alerts</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Real-time alerts for enforcement zones, accidents, and traffic updates
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Active Alerts</p>
            <p className="mt-2 text-3xl font-bold text-danger-600">
              {trafficAlerts.length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">High Severity</p>
            <p className="mt-2 text-3xl font-bold text-danger-600">
              {trafficAlerts.filter((a) => a.severity === 'high').length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">High</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">
              {trafficAlerts.filter((a) => a.severity === 'high').length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm text-dark-600 dark:text-dark-400">Medium</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">
              {trafficAlerts.filter((a) => a.severity === 'medium').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {trafficAlerts.map((alert) => (
          <Card key={alert.id} interactive>
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{
                  alert.type === 'enforcement'
                    ? '🚨'
                    : alert.type === 'accident'
                    ? '⚠️'
                    : alert.type === 'congestion'
                    ? '🚗'
                    : alert.type === 'roadwork'
                    ? '🚧'
                    : '☔'
                }</div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold capitalize">{alert.type}</h3>
                    <Badge
                      variant={
                        alert.severity === 'high'
                          ? 'danger'
                          : alert.severity === 'medium'
                          ? 'warning'
                          : 'primary'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm">{alert.message}</p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-dark-600 dark:text-dark-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {alert.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle size={14} />
                      Posted {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    👁️
                  </Button>
                  <Button size="sm" variant="ghost">
                    ✓
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader
          title="Alert Preferences"
          subtitle="Customize which alerts you want to receive"
        />
        <CardContent className="space-y-4">
          {[
            { name: 'Enforcement Zones', enabled: true },
            { name: 'Accidents & Incidents', enabled: true },
            { name: 'Traffic Congestion', enabled: true },
            { name: 'Road Works', enabled: false },
            { name: 'Weather Alerts', enabled: true },
            { name: 'Document Expiry', enabled: true },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between">
              <label className="font-medium">{pref.name}</label>
              <input
                type="checkbox"
                defaultChecked={pref.enabled}
                className="h-4 w-4 rounded"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader title="Safety Tips" />
        <CardContent>
          <div className="space-y-2">
            {[
              'Check real-time alerts before starting your journey',
              'Reduce speed in areas marked as enforcement zones',
              'Follow alternate routes suggested during congestion',
              'Enable location sharing for emergency SOS',
              'Keep your documents updated in the system',
            ].map((tip, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-0.5 text-primary-600">ℹ️</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Download, Upload, CheckCircle, Clock, WifiOff, Database, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import offline from '@/lib/offline'
import { trafficLaws } from '@/lib/mockData'

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [cachedCount, setCachedCount] = useState(0)
  const [outboxCount, setOutboxCount] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const cached = await offline.getCachedLaws()
        const outbox = await offline.getOutboxItems()
        if (!mounted) return
        setCachedCount(cached?.length || 0)
        setOutboxCount(outbox?.length || 0)
      } catch (e) {
        console.warn('offline load failed', e)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Offline Sync</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Cached law data stays available offline and syncs automatically when connectivity returns
        </p>
      </div>

      <Card className="border border-primary-100 bg-white/95 dark:border-dark-700 dark:bg-dark-800">
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/30">
            <WifiOff className="text-primary-700 dark:text-primary-300" size={22} />
            <p className="mt-3 font-semibold text-dark-900 dark:text-white">Offline Access</p>
            <p className="mt-1 text-sm text-dark-600 dark:text-dark-300">
              View laws, challans, and document records without an internet connection.
            </p>
          </div>
          <div className="rounded-xl bg-success-50 p-4 dark:bg-success-900/20">
            <Database className="text-success-700 dark:text-success-300" size={22} />
            <p className="mt-3 font-semibold text-dark-900 dark:text-white">Cached Law Data</p>
            <p className="mt-1 text-sm text-dark-600 dark:text-dark-300">
              Frequently used Motor Vehicles Act sections and state rules are stored locally.
            </p>
          </div>
          <div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
            <RefreshCcw className="text-warning-700 dark:text-warning-300" size={22} />
            <p className="mt-3 font-semibold text-dark-900 dark:text-white">Sync Recovery</p>
            <p className="mt-1 text-sm text-dark-600 dark:text-dark-300">
              Changes queue locally and sync automatically once connectivity is restored.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Outbox" subtitle="Queued actions waiting for network" />
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm">{outboxCount} queued item(s)</p>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  const items = await offline.getOutboxItems()
                  setOutboxCount(items.length)
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Sync Status" subtitle="Offline-first content is ready for use" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-dark-50 p-4 dark:bg-dark-700">
              <p className="text-sm text-dark-600 dark:text-dark-400">Last Sync</p>
              <p className="mt-2 font-semibold">2 minutes ago</p>
            </div>
            <div className="rounded-lg bg-dark-50 p-4 dark:bg-dark-700">
              <p className="text-sm text-dark-600 dark:text-dark-400">Data Size</p>
              <p className="mt-2 font-semibold">245 MB</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={async () => {
                setIsSyncing(true)
                try {
                  // Cache known laws (mock) locally
                  await offline.cacheLaws(trafficLaws)
                  setCachedCount((c) => c + (trafficLaws?.length || 0))

                  // Attempt to flush the outbox when online
                  if (navigator.onLine) {
                    const outbox = await offline.getOutboxItems()
                    if (outbox.length) {
                      await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: outbox }),
                      })
                      await offline.clearOutbox()
                      setOutboxCount(0)
                    }
                  }
                } catch (e) {
                  console.warn('Sync failed', e)
                } finally {
                  setIsSyncing(false)
                }
              }}
              loading={isSyncing}
              icon={<Download size={16} />}
              className="flex-1"
            >
              Sync Now
            </Button>
            <Button variant="secondary" className="flex-1">
              <Upload size={16} />
              Upload Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Offline Content" subtitle="Data available for offline use" />
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Traffic Laws (All States)', size: '45 MB', status: 'synced' },
              { name: 'Violation Database', size: '78 MB', status: 'synced' },
              { name: 'Enforcement Zones', size: '32 MB', status: 'synced' },
              { name: 'My Documents', size: '12 MB', status: 'synced' },
              { name: 'Challan History', size: '5 MB', status: 'synced' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-dark-200 p-3 dark:border-dark-700">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-dark-600 dark:text-dark-400">{item.size}</p>
                </div>
                <Badge variant="success">
                  <CheckCircle size={14} className="mr-1" />
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Sync Settings" />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">Auto-sync enabled</label>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sync frequency</label>
            <select className="input">
              <option>Every hour</option>
              <option>Every 6 hours</option>
              <option>Every 24 hours</option>
              <option>Manual only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sync only on WiFi</label>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}

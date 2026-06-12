'use client'

import React, { useState } from 'react'
import { ChevronRight, Download, Share2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { trafficLaws } from '@/lib/mockData'
import { geoZones, getZoneFineMultiplier } from '@/lib/geo-rules'

const states = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'West Bengal']
const vehicleTypes = ['Car', 'Motorcycle', 'Commercial Vehicle', 'Three-Wheeler']
const violationTypes = [
  { name: 'Speeding', baseFine: 500 },
  { name: 'Helmet Violation', baseFine: 100 },
  { name: 'Traffic Signal', baseFine: 800 },
  { name: 'Parking Violation', baseFine: 600 },
  { name: 'Dangerous Driving', baseFine: 1000 },
  { name: 'No Insurance', baseFine: 2000 },
  { name: 'No Pollution Certificate', baseFine: 1500 },
  { name: 'Document Missing', baseFine: 300 },
]

export default function ChallanCalculatorPage() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState(states[0])
  const [vehicleType, setVehicleType] = useState(vehicleTypes[0])
  const [zoneId, setZoneId] = useState(geoZones[0].id)
  const [selectedViolations, setSelectedViolations] = useState<string[]>([])
  const [isRepeatOffender, setIsRepeatOffender] = useState(false)

  const calculateTotal = () => {
    let total = 0
    selectedViolations.forEach((v) => {
      const violation = violationTypes.find((vt) => vt.name === v)
      if (violation) {
        let fine = violation.baseFine
        fine *= getZoneFineMultiplier(zoneId, v)
        if (isRepeatOffender) {
          fine *= 1.5
        }
        total += fine
      }
    })
    return total
  }

  const toggleViolation = (violation: string) => {
    setSelectedViolations((prev) =>
      prev.includes(violation)
        ? prev.filter((v) => v !== violation)
        : [...prev, violation]
    )
  }

  const totalFine = calculateTotal()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Challan Calculator</h1>
        <p className="mt-1 text-dark-600 dark:text-dark-400">
          Calculate traffic violation fines based on traffic regulations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calculator Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step Indicator */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex flex-col items-center">
                    <button
                      onClick={() => setStep(s)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                        step >= s
                          ? 'bg-primary-600 text-white'
                          : 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-400'
                      }`}
                    >
                      {s}
                    </button>
                    <p className="mt-2 text-xs font-medium">
                      {['Select State', 'Geo-Zone', 'Vehicle', 'Violations', 'Review'][s - 1]}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 1: State Selection */}
          {step === 1 && (
            <Card>
              <CardHeader title="Select State/Region" subtitle="Choose your location for applicable traffic laws" />
              <CardContent>
                <div className="space-y-2">
                  {states.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setState(s)
                        setStep(2)
                      }}
                      className="block w-full rounded-lg border-2 border-dark-200 bg-white p-4 text-left transition-all hover:border-primary-500 dark:border-dark-700 dark:bg-dark-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{s}</p>
                          <p className="text-xs text-dark-600 dark:text-dark-400">
                            {trafficLaws.filter((l) => l.state === s).length} laws available
                          </p>
                        </div>
                        <ChevronRight className="text-dark-400" size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1.5: Geo-zone detection */}
          {step === 2 && (
            <Card>
              <CardHeader
                title="Detect Geo-Zone"
                subtitle="Pick the enforcement zone or use GPS-selected region before fine calculation"
              />
              <CardContent className="space-y-3">
                {geoZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setZoneId(zone.id)
                      setStep(3)
                    }}
                    className={`block w-full rounded-lg border-2 p-4 text-left transition-all ${
                      zoneId === zone.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-dark-700'
                        : 'border-dark-200 bg-white hover:border-primary-300 dark:border-dark-700 dark:bg-dark-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{zone.name}</p>
                        <p className="text-xs text-dark-600 dark:text-dark-400">{zone.description}</p>
                        <p className="mt-2 text-xs text-dark-500 dark:text-dark-400">
                          Speed limit: {zone.speedLimit} · Multiplier: {zone.fineMultiplier}x
                        </p>
                      </div>
                      <Badge variant="warning">{zone.type}</Badge>
                    </div>
                  </button>
                ))}
                <p className="text-xs text-dark-500 dark:text-dark-400">
                  School zones and accident hotspots automatically increase fines for relevant violations.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Vehicle Type */}
          {step === 3 && (
            <Card>
              <CardHeader title="Select Vehicle Type" subtitle="Choose the type of vehicle" />
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicleTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setVehicleType(type)
                        setStep(3)
                      }}
                      className={`rounded-lg border-2 p-4 text-center transition-all ${
                        vehicleType === type
                          ? 'border-primary-600 bg-primary-50 dark:bg-dark-700'
                          : 'border-dark-200 hover:border-primary-300 dark:border-dark-700'
                      }`}
                    >
                      <p className="text-2xl mb-2">
                        {type === 'Car'
                          ? '🚗'
                          : type === 'Motorcycle'
                          ? '🏍️'
                          : type === 'Commercial Vehicle'
                          ? '🚚'
                          : '🛺'}
                      </p>
                      <p className="font-semibold">{type}</p>
                    </button>
                  ))}
                </div>
                <Button onClick={() => setStep(4)} className="mt-4 w-full">
                  Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Violations */}
          {step === 4 && (
            <Card>
              <CardHeader title="Select Violations" subtitle="Choose applicable traffic violations" />
              <CardContent className="space-y-3">
                {violationTypes.map((v) => (
                  <div key={v.name} className="flex items-center gap-3 rounded-lg border border-dark-200 p-3 dark:border-dark-700">
                    <input
                      type="checkbox"
                      id={v.name}
                      checked={selectedViolations.includes(v.name)}
                      onChange={() => toggleViolation(v.name)}
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor={v.name} className="flex-1 cursor-pointer">
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-dark-600 dark:text-dark-400">
                        Base fine: {formatCurrency(v.baseFine)}
                      </p>
                    </label>
                  </div>
                ))}

                <div className="rounded-lg border border-warning-200 bg-warning-50 p-4 dark:border-warning-900 dark:bg-dark-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 text-warning-600" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-warning-800 dark:text-warning-200">
                        Repeat Offender?
                      </p>
                      <input
                        type="checkbox"
                        checked={isRepeatOffender}
                        onChange={(e) => setIsRepeatOffender(e.target.checked)}
                        className="mt-2 h-4 w-4"
                      />
                      <label className="ml-2 text-sm">Yes, I have prior violations (50% increase)</label>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep(5)} className="w-full">
                  Review Challan
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Generate */}
          {step === 5 && (
            <Card>
              <CardHeader title="Review Challan" subtitle="Verify and generate official challan" />
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-dark-200 bg-dark-50 p-4 dark:border-dark-700 dark:bg-dark-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">State</p>
                      <p className="font-semibold">{state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">Vehicle</p>
                      <p className="font-semibold">{vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">Violations</p>
                      <p className="font-semibold">{selectedViolations.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">Geo-Zone</p>
                      <p className="font-semibold">{geoZones.find((z) => z.id === zoneId)?.type || 'Standard'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-600 dark:text-dark-400">Status</p>
                      <Badge variant={isRepeatOffender ? 'warning' : 'success'}>
                        {isRepeatOffender ? 'Repeat Offender' : 'First Time'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Violation Breakdown</h4>
                  {selectedViolations.map((v) => {
                    const violation = violationTypes.find((vt) => vt.name === v)
                    const geoMultiplier = getZoneFineMultiplier(zoneId, v)
                    const fine = violation ? violation.baseFine * geoMultiplier * (isRepeatOffender ? 1.5 : 1) : 0
                    return (
                      <div key={v} className="flex justify-between text-sm">
                        <span>{v}</span>
                        <span className="font-semibold">{formatCurrency(fine)}</span>
                      </div>
                    )
                  })}
                  <div className="border-t border-dark-200 pt-2 dark:border-dark-700">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Fine</span>
                      <span className="text-danger-600">{formatCurrency(totalFine)}</span>
                    </div>
                    <p className="mt-2 text-xs text-dark-500 dark:text-dark-400">
                      Geo-zone rules are applied before repeat-offender penalties.
                    </p>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Download size={18} />
                  Download PDF Challan
                </Button>
                <Button variant="secondary" className="w-full">
                  <Share2 size={18} />
                  Share Challan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Card */}
        <div className="h-fit space-y-4">
          <Card className="sticky top-6">
            <CardHeader title="Summary" />
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-dark-600 dark:text-dark-400">Selected State</p>
                <p className="font-semibold">{state}</p>
              </div>
              <div>
                <p className="text-xs text-dark-600 dark:text-dark-400">Vehicle Type</p>
                <p className="font-semibold">{vehicleType}</p>
              </div>
              <div>
                <p className="text-xs text-dark-600 dark:text-dark-400">Violations Selected</p>
                <p className="font-semibold">{selectedViolations.length}</p>
              </div>

              {selectedViolations.length > 0 && (
                <>
                  <div className="rounded-lg bg-dark-50 p-3 dark:bg-dark-700">
                    <p className="text-xs text-dark-600 dark:text-dark-400">Calculated Fine</p>
                    <p className="mt-1 text-2xl font-bold text-primary-600">
                      {formatCurrency(totalFine)}
                    </p>
                    {isRepeatOffender && (
                      <p className="mt-1 text-xs text-warning-600">+50% for repeat offense</p>
                    )}
                  </div>

                  <div className="rounded-lg bg-warning-50 p-3 dark:bg-dark-700">
                    <p className="text-xs text-warning-800 dark:text-warning-200">
                      Geo-zone active: {geoZones.find((z) => z.id === zoneId)?.type || 'Standard'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-success-50 p-3 dark:bg-dark-700">
                    <p className="text-xs text-success-700 dark:text-success-200">
                      ✓ Calculation based on {state} traffic regulations
                    </p>
                  </div>
                </>
              )}

              <Button className="w-full" disabled={selectedViolations.length === 0}>
                Generate Challan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

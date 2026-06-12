export type GeoZoneType = 'School Zone' | 'Speed Restricted' | 'Commercial Area' | 'Accident Hotspot'

export interface GeoZoneRule {
  id: string
  name: string
  type: GeoZoneType
  speedLimit: string
  fineMultiplier: number
  stricterFor: string[]
  description: string
}

export const geoZones: GeoZoneRule[] = [
  {
    id: 'zone_school_01',
    name: 'Outer Ring Road',
    type: 'School Zone',
    speedLimit: '40 km/h',
    fineMultiplier: 2,
    stricterFor: ['Speeding', 'Traffic Signal'],
    description: 'School zones enforce lower speed limits and stricter penalties for speeding.',
  },
  {
    id: 'zone_speed_01',
    name: 'Silk Board Junction',
    type: 'Speed Restricted',
    speedLimit: '40 km/h',
    fineMultiplier: 1.5,
    stricterFor: ['Speeding'],
    description: 'Speed-restricted corridors raise penalties for over-speeding.',
  },
  {
    id: 'zone_commercial_01',
    name: 'Brigade Road',
    type: 'Commercial Area',
    speedLimit: '50 km/h',
    fineMultiplier: 1.25,
    stricterFor: ['Parking Violation', 'Traffic Signal'],
    description: 'Commercial areas apply stricter parking and signal enforcement.',
  },
  {
    id: 'zone_accident_01',
    name: 'Whitefield Stretch',
    type: 'Accident Hotspot',
    speedLimit: '30 km/h',
    fineMultiplier: 1.75,
    stricterFor: ['Speeding', 'Dangerous Driving'],
    description: 'Accident hotspots use the toughest enforcement for risky driving.',
  },
]

export function getZoneRule(zoneId: string) {
  return geoZones.find((zone) => zone.id === zoneId)
}

export function getZoneFineMultiplier(zoneId: string, violationType: string) {
  const zone = getZoneRule(zoneId)
  if (!zone) return 1
  return zone.stricterFor.includes(violationType) ? zone.fineMultiplier : 1
}

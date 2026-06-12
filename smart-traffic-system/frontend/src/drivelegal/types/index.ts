export interface User {
  id: string
  name: string
  email: string
  role: 'citizen' | 'police' | 'admin' | 'government'
  avatar?: string
  location?: string
  language?: string
}

export interface Vehicle {
  id: string
  registrationNumber: string
  vehicleType: 'car' | 'motorcycle' | 'commercial' | 'other'
  manufacturer: string
  model: string
  year: number
  color: string
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  insuranceExpiry?: string
  pollutionCertificateExpiry?: string
}

export interface TrafficLaw {
  id: string
  state: string
  title: string
  description: string
  fineAmount: number
  violationType: string
  category: string
  amendmentDate?: string
  source: string
  applicableVehicles: string[]
  relatedSections?: string[]
}

export interface Violation {
  id: string
  type: string
  location: string
  date: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  fineAmount: number
  description: string
  state: string
  officer?: string
  status: 'resolved' | 'pending' | 'appealed'
}

export interface Challan {
  id: string
  violationId: string
  citizenName: string
  registrationNumber: string
  violations: ViolationType[]
  totalFine: number
  issuedDate: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  paymentMethod?: string
}

export interface ViolationType {
  id: string
  name: string
  baseFine: number
  repeatOffenseFactor: number
  vehicleTypeVariation?: Record<string, number>
}

export interface State {
  code: string
  name: string
  region: string
  capital: string
  laws: TrafficLaw[]
  violationTrends?: ViolationTrend[]
}

export interface ViolationTrend {
  date: string
  count: number
  type: string
}

export interface TrafficAlert {
  id: string
  type: 'enforcement' | 'accident' | 'weather' | 'congestion' | 'roadwork'
  location: string
  severity: 'low' | 'medium' | 'high'
  message: string
  timestamp: string
  coordinates?: { lat: number; lng: number }
}

export interface AnalyticsData {
  totalViolations: number
  avgFineAmount: number
  complianceRate: number
  enforcementZones: number
  accidentHotspots: number
  trends: {
    date: string
    violations: number
    accidents: number
    fines: number
  }[]
}

export interface AIInsight {
  id: string
  type: 'recommendation' | 'warning' | 'info'
  title: string
  description: string
  actionItems?: string[]
  confidence: number
  timestamp: string
}

export interface Document {
  id: string
  type: 'license' | 'registration' | 'insurance' | 'pollution' | 'other'
  name: string
  url: string
  expiryDate?: string
  uploadedDate: string
  status: 'valid' | 'expiring' | 'expired'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: Citation[]
  metadata?: Record<string, any>
}

export interface Citation {
  id: string
  title: string
  source: string
  relevance: number
  state?: string
}

export interface NotificationItem {
  id: string
  type: 'alert' | 'reminder' | 'update' | 'warning'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface Dashboard {
  userId: string
  totalFines: number
  pendingChallan: number
  complianceScore: number
  recentViolations: Violation[]
  trafficAlerts: TrafficAlert[]
  aiInsights: AIInsight[]
}

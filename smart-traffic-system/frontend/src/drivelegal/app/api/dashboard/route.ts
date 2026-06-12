import { NextResponse } from 'next/server'
import {
  currentUser,
  vehicles,
  violations,
  challans,
  dashboardData,
  trafficAlerts,
} from '@/lib/mockData'

export async function GET() {
  try {
    const response = {
      success: true,
      data: {
        user: currentUser,
        vehicles,
        summary: {
          totalViolations: violations.length,
          pendingViolations: violations.filter((v) => v.status === 'pending').length,
          resolvedViolations: violations.filter((v) => v.status === 'resolved').length,
          totalFines: challans.reduce((sum, c) => sum + c.totalFine, 0),
          pendingFines: challans
            .filter((c) => c.status === 'pending')
            .reduce((sum, c) => sum + c.totalFine, 0),
          complianceScore: dashboardData.complianceScore,
          riskLevel: 'Low',
        },
        recentViolations: violations.slice(0, 5),
        pendingChallans: challans.filter((c) => c.status === 'pending'),
        trafficAlerts: trafficAlerts.slice(0, 5),
      },
      timestamp: new Date().toISOString(),
    }
    return NextResponse.json(response)
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { trafficAlerts } from '@/lib/mockData'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const state = searchParams.get('state')

    let filteredAlerts = [...trafficAlerts]

    if (type) {
      filteredAlerts = filteredAlerts.filter((a) => a.type === type)
    }

    if (state) {
      filteredAlerts = filteredAlerts.filter((a) => a.state === state)
    }

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      count: filteredAlerts.length,
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

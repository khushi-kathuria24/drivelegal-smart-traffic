import { NextResponse } from 'next/server'
import { trafficLaws } from '@/lib/mockData'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const violationType = searchParams.get('violationType')

    let filteredLaws = [...trafficLaws]

    if (state) {
      filteredLaws = filteredLaws.filter((law) => law.state === state)
    }

    if (violationType) {
      filteredLaws = filteredLaws.filter((law) => law.violationType === violationType)
    }

    return NextResponse.json({
      success: true,
      data: filteredLaws,
      count: filteredLaws.length,
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch traffic laws' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In production persist received law data to DB. Here we just echo.
    console.log('Ingest laws:', Array.isArray(body.laws) ? body.laws.length : 0)
    return NextResponse.json({ ingested: Array.isArray(body.laws) ? body.laws.length : 0 })
  } catch (_err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

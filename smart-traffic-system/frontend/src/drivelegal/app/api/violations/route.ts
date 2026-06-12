import { NextResponse } from 'next/server'
import { violations } from '@/lib/mockData'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')

    let filteredViolations = [...violations]

    if (status) {
      filteredViolations = filteredViolations.filter((v) => v.status === status)
    }

    if (severity) {
      filteredViolations = filteredViolations.filter((v) => v.severity === severity)
    }

    return NextResponse.json({
      success: true,
      data: filteredViolations,
      count: filteredViolations.length,
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch violations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.type || !body.location || !body.severity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new violation (mock)
    const newViolation = {
      id: `violation_${Date.now()}`,
      type: body.type,
      location: body.location,
      date: new Date().toISOString().split('T')[0],
      severity: body.severity,
      fineAmount: body.fineAmount || 0,
      description: body.description || '',
      state: body.state || 'Karnataka',
      officer: body.officer || 'Officer',
      status: 'pending',
    }

    return NextResponse.json(
      {
        success: true,
        data: newViolation,
        message: 'Violation recorded successfully',
      },
      { status: 201 }
    )
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create violation' },
      { status: 500 }
    )
  }
}

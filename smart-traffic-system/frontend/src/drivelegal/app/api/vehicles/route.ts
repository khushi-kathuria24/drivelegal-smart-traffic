import { NextResponse } from 'next/server'
import { vehicles } from '@/lib/mockData'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: vehicles,
      count: vehicles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.registrationNumber || !body.vehicleType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newVehicle = {
      id: `vehicle_${Date.now()}`,
      registrationNumber: body.registrationNumber,
      vehicleType: body.vehicleType,
      manufacturer: body.manufacturer || '',
      model: body.model || '',
      year: body.year || new Date().getFullYear(),
      color: body.color || '',
      fuelType: body.fuelType || '',
      insuranceExpiry: body.insuranceExpiry || '',
      pollutionCertificateExpiry: body.pollutionCertificateExpiry || '',
    }

    return NextResponse.json(
      {
        success: true,
        data: newVehicle,
        message: 'Vehicle registered successfully',
      },
      { status: 201 }
    )
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: 'Failed to register vehicle' },
      { status: 500 }
    )
  }
}

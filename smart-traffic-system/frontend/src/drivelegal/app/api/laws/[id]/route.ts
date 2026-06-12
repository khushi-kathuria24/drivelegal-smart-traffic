import { NextResponse } from 'next/server'
import { trafficLaws } from '@/lib/mockData'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const law = trafficLaws.find((l) => l.id === id)
  if (!law) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ law })
}

import { NextResponse } from 'next/server'
import { getLiveTrackInfo } from '@/lib/spotify'

export async function GET() {
  try {
    const liveTrackInfo = await getLiveTrackInfo()
    return NextResponse.json(liveTrackInfo)
  } catch (error) {
    console.error('Error fetching live track info:', error)
    return NextResponse.json({ error: 'Failed to fetch live track info' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { getCurrentTrack } from '@/lib/spotify'

export async function GET() {
  try {
    const track = await getCurrentTrack()
    if (track) {
      return NextResponse.json(track)
    } else {
      return NextResponse.json({ 
        error: 'No track currently playing', 
        message: 'It seems there is no song currently being played on Spotify.' 
      }, { status: 204 })
    }
  } catch (error) {
    console.error('Error fetching current track:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

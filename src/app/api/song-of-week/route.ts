import { NextResponse } from 'next/server';
import Song from '@/models/Song';
import connectDb from '@/lib/connect';

export async function GET() {
  try {
    await connectDb();
    const song = await Song.findOne({ isSongOfTheWeek: true });

    if (!song) {
      return NextResponse.json({ error: 'No song of the week found' }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error('Error fetching song of the week:', error);
    return NextResponse.json({ error: 'Failed to fetch song of the week' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import connectDb from '@/lib/connect';
import Song from '@/models/Song';

export async function GET() {
  try {
    await connectDb();
    const favorites = await Song.find({ isFavorite: true }).limit(5);

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorite songs:', error);
    return NextResponse.json({ error: 'Failed to fetch favorite songs' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { adminDB } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

async function getLikes(slug: string): Promise<string[]> {
  const docRef = adminDB.collection('likes').doc(slug);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const data = docSnap.data();
    if (data && Array.isArray(data.likes)) {
      return data.likes as string[];
    }
  }

  return [];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const likes = await getLikes(slug);
    return NextResponse.json({ likes });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = token.email as string;
    const { slug } = params;
    const docRef = adminDB.collection('likes').doc(slug);

    let likes = await getLikes(slug);
    const isLiked = likes.includes(userEmail);

    if (isLiked) {
      // Unlike
      await docRef.update({
        likes: admin.firestore.FieldValue.arrayRemove(userEmail),
      });
    } else {
      // Like
      await docRef.set(
        {
          likes: admin.firestore.FieldValue.arrayUnion(userEmail),
        },
        { merge: true }
      );
    }

    const updatedLikes = await getLikes(slug);

    return NextResponse.json({ likes: updatedLikes });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
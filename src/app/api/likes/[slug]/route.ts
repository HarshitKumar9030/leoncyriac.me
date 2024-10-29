import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { adminDB } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const docRef = adminDB.collection('likes').doc(slug);
  const docSnap = await docRef.get();

  let likes: string[] = [];
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data && Array.isArray(data.likes)) {
      likes = data.likes as string[];
    }
  }

  return NextResponse.json({ likes });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const token = await getToken({ req: request });
  if (!token || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = token.email as string;
  const { slug } = params;
  const docRef = adminDB.collection('likes').doc(slug);
  const docSnap = await docRef.get();

  let likes: string[] = [];
  if (docSnap.exists) {
    const data = docSnap.data();
    if (data && Array.isArray(data.likes)) {
      likes = data.likes as string[];
    }
  }

  if (likes.includes(userEmail)) {
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

  // Fetch the updated likes
  const updatedDoc = await docRef.get();
  let updatedLikes: string[] = [];
  if (updatedDoc.exists) {
    const data = updatedDoc.data();
    if (data && Array.isArray(data.likes)) {
      updatedLikes = data.likes as string[];
    }
  }

  return NextResponse.json({ likes: updatedLikes });
}
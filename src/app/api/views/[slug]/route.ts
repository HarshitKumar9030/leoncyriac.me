import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const docRef = adminDB.collection('views').doc(slug);
  const docSnap = await docRef.get();
  const views = docSnap.exists ? docSnap.data()?.count : 0;

  return NextResponse.json({ count: views });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const docRef = adminDB.collection('views').doc(slug);
  await docRef.set(
    { count: admin.firestore.FieldValue.increment(1) },
    { merge: true }
  );

  return NextResponse.json({ success: true });
}
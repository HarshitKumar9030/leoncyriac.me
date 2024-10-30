import { NextRequest, NextResponse } from 'next/server';
import { adminDB } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const docRef = adminDB.collection('views').doc(slug);
    const docSnap = await docRef.get();
    const views = docSnap.exists ? docSnap.data()?.count : 0;

    return NextResponse.json({ count: views });
  } catch (error) {
    console.error('Error fetching view count:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const docRef = adminDB.collection('views').doc(slug);
    
    // Using transaction to ensure atomicity
    const result = await adminDB.runTransaction(async (transaction) => {
      const docSnap = await transaction.get(docRef);
      const newCount = (docSnap.exists ? docSnap.data()?.count : 0) + 1;
      transaction.set(docRef, { count: newCount }, { merge: true });
      return newCount;
    });

    return NextResponse.json({ success: true, count: result });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
  }
}
'use server'

import connectDb from '@/lib/connect';
import GalleryItem from '@/models/GalleryItem';

export async function getGalleryItems() {
  await connectDb();
  const items = await GalleryItem.find().sort({ createdAt: -1 });
  return JSON.stringify(items);
}

export async function addGalleryItem(itemData: string) {
  await connectDb();
  const { title, description, imageUrl } = JSON.parse(itemData);
  const newItem = new GalleryItem({ title, description, imageUrl });
  await newItem.save();
  return JSON.stringify(newItem);
}


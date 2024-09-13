import mongoose, { Schema, Document } from 'mongoose';
import { ILastVisited } from '@/types/types';

const LastVisitedSchema: Schema = new Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
  });

export default mongoose.models.LastVisited || mongoose.model<ILastVisited>('LastVisited', LastVisitedSchema);

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the IReply interface
export interface IReply extends mongoose.Document {
  author: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  reported: boolean;
  replies: IReply[];
}

// Define the ReplySchema
const ReplySchema = new Schema<IReply>({
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // List of user emails who liked the reply
  reported: { type: Boolean, default: false },
  // replies will be added later
});

// Add the 'replies' field to ReplySchema
ReplySchema.add({
  replies: [ReplySchema],
});

// Define the IComment interface
export interface IComment extends mongoose.Document {
  postSlug: string;
  author: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  reported: boolean;
  replies: IReply[];
}

// Define the CommentSchema
const CommentSchema = new Schema<IComment>({
  postSlug: { type: String, required: true, index: true },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  reported: { type: Boolean, default: false },
  replies: [ReplySchema],
});

// Indexing
CommentSchema.index({ postSlug: 1, createdAt: -1 });

// Export the Comment model
export default mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', CommentSchema);

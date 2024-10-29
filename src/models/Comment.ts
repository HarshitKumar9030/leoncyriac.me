import mongoose from 'mongoose';

const { Schema } = mongoose;

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

const ReplySchema = new Schema<IReply>({
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  reported: { type: Boolean, default: false },
});

ReplySchema.add({
  replies: [ReplySchema],
});

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

CommentSchema.index({ postSlug: 1, createdAt: -1 });

export default mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', CommentSchema);

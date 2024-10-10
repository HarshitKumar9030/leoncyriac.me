import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  reported: { type: Boolean, default: false }
});

const CommentSchema = new mongoose.Schema({
  postSlug: { type: String, required: true, index: true },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  reported: { type: Boolean, default: false },
  replies: [ReplySchema]
});

export interface IReply extends mongoose.Document {
  author: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  reported: boolean;
}

export interface IComment extends mongoose.Document {
  postSlug: string;
  author: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  reported: boolean;
  replies: IReply[];
}

CommentSchema.index({ postSlug: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
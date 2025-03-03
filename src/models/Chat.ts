import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  user: {
    type: String,  // email
    required: true,
    index: true,
  },
  blogTitle: {
    type: String,
    required: true,
  },
  postSlug: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for finding chats by user, blogTitle, and postSlug
chatSchema.index({ user: 1, blogTitle: 1, postSlug: 1 }, { unique: true });

// Update the updatedAt field on save
chatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Use existing model if it's already been compiled, or create a new one
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
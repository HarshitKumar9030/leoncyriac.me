import mongoose from 'mongoose';

const UserChatLimitSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  dailyChatsUsed: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  },
  bonusChats: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Reset dailyChatsUsed if it's a new day
UserChatLimitSchema.methods.checkAndResetDaily = function() {
  const today = new Date();
  const lastReset = new Date(this.lastResetDate);
  
  if (lastReset.getDate() !== today.getDate() || 
      lastReset.getMonth() !== today.getMonth() || 
      lastReset.getFullYear() !== today.getFullYear()) {
    this.dailyChatsUsed = 0;
    this.lastResetDate = today;
    return true;
  }
  return false;
};

export default mongoose.models.UserChatLimit || mongoose.model('UserChatLimit', UserChatLimitSchema);
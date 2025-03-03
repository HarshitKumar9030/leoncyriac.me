import mongoose from 'mongoose';

const CodeRedemptionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    required: true
  },
  extraChats: {
    type: Number,
    required: true
  },
  redeemedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.CodeRedemption || mongoose.model('CodeRedemption', CodeRedemptionSchema);
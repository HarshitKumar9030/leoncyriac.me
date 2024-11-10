import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length >= 2, 'Poll must have at least 2 options'],
  },
  votes: {
    type: [Number],
    // @ts-ignore
    default: function() {
            // @ts-ignore
      return new Array(this.options.length).fill(0);
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);
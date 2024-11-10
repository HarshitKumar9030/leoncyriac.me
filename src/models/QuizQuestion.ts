import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length === 4, 'Options must have exactly 4 items'],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

export default mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', QuizQuestionSchema);
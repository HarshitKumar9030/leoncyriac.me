'use server'

import dbConnect from '@/lib/connect';
import QuizQuestion from '@/models/QuizQuestion';

export async function getQuizQuestions() {
  await dbConnect();
  const questions = await QuizQuestion.find({}).lean();
  return JSON.parse(JSON.stringify(questions));
}

export async function submitQuizAnswers(answers: { [key: string]: string }) {
  await dbConnect();
  const questions = await QuizQuestion.find({}).lean();

  let score = 0;
  for (const question of questions) {
    // @ts-ignore
    if (answers[question._id.toString()] === question.correctAnswer) {
      score++;
    }
  }

  return { score, total: questions.length };
}

export async function addQuizQuestion(question: string, options: string[], correctAnswer: string) {
  await dbConnect();
  const newQuestion = new QuizQuestion({
    question,
    options,
    correctAnswer,
  });
  await newQuestion.save();
  return JSON.stringify(newQuestion._id);
}
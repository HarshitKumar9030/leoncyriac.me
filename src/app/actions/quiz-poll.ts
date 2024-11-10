"use server";

import dbConnect from "@/lib/connect";
import QuizQuestion from "@/models/QuizQuestion";
import Poll from "@/models/Poll";

interface PollData {
  question: string;
  validOptions: string[];
}

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

export async function addQuizQuestion(
  question: string,
  options: string[],
  correctAnswer: string
) {
  await dbConnect();
  const newQuestion = new QuizQuestion({
    question,
    options,
    correctAnswer,
  });
  await newQuestion.save();
  return newQuestion._id;
}

export async function createPoll(pollString: string): Promise<string> {
  try {
    const pollData: PollData = JSON.parse(pollString);

    if (
      !pollData.question ||
      !Array.isArray(pollData.validOptions) ||
      pollData.validOptions.length < 2
    ) {
      throw new Error(
        "Invalid poll data: Question and at least two valid options are required"
      );
    }

    await dbConnect();

    const newPoll = new Poll({
      question: pollData.question,
      options: pollData.validOptions,
    });

    await newPoll.save();

    return JSON.stringify(newPoll._id);
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
}

export async function getPolls() {
  await dbConnect();
  const polls = await Poll.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(polls));
}

export async function votePoll(pollString: string) {
  const p: any = JSON.parse(pollString);
  // console.log(p)
  const pollId = p.pollId;
  const optionIndex = p.selectedOptions;
  await dbConnect();
  const poll = await Poll.findById(pollId);
  if (!poll) {
    throw new Error("Poll not found");
  }
  poll.votes[optionIndex]++;
  await poll.save();
  return JSON.stringify(poll);
}

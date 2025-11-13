'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import ROUTES from '@/constants/routes';
import Answer, { IAnswerDocument } from '@/database/answer.model';
import Question from '@/database/question.model';
import Vote from '@/database/vote.model';
import { ActionResponse, ErrorResponse } from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { NotFoundError, UnauthorizedError } from '../http-errors';
import { CreateAnswerSchema, DeleteAnswerSchema, GetAnswersSchema } from '../validation';
import { createInteraction } from './interaction.action';

export async function getAllAnswers(params: GetAnswerParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({ params, schema: GetAnswersSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { questionId, page = 1, pageSize = 10, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case 'latest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'oldest':
      sortCriteria = { createdAt: 1 };
      break;
    case 'popular':
      sortCriteria = { upvotes: -1, createdAt: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id name image')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = skip + answers.length < totalAnswers;

    return {
      success: true,
      data: {
        answers,
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDocument>> {
  const validationResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new NotFoundError('Question');
    }

    const [newAnswer] = await Answer.create(
      [
        {
          content,
          question: questionId,
          author: userId,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error('Failed to create answer');

    question.answer += 1;
    await question.save({ session });

    after(async () => {
      await createInteraction({
        action: 'post',
        actionId: newAnswer._id.toString(),
        actionTarget: 'answer',
        authorId: userId as string,
      });
    });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function deleteAnswer(params: DeleteAnswerParams): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: DeleteAnswerSchema, authorize: true });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { answerId } = validationResult.params!;
  const { user } = validationResult.session!;

  try {
    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new NotFoundError('Answer');
    }

    if (answer.author.toString() !== user?.id) {
      throw new UnauthorizedError();
    }

    await Question.findByIdAndUpdate(answer.question, { $inc: { answer: -1 } }, { new: true });

    await Vote.deleteMany({ targetId: answer._id, targetType: 'Answer' });

    await Answer.findByIdAndDelete(answerId);

    after(async () => {
      await createInteraction({
        action: 'delete',
        actionId: answerId,
        actionTarget: 'answer',
        authorId: user?.id as string,
      });
    });

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

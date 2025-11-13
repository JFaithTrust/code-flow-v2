'use server';

import mongoose, { ClientSession } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import ROUTES from '@/constants/routes';
import Answer from '@/database/answer.model';
import Question from '@/database/question.model';
import Vote from '@/database/vote.model';
import { ActionResponse, ErrorResponse } from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { NotFoundError } from '../http-errors';
import { CreateVoteSchema, HasVotedSchema, UpdateVoteSchema } from '../validation';
import { createInteraction } from './interaction.action';

export async function createVote(params: CreateVoteParams): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const Model = targetType === 'question' ? Question : Answer;
    const target = await Model.findById(targetId).session(session);

    if (!target) {
      throw new NotFoundError(`${targetType.charAt(0).toUpperCase() + targetType.slice(1)}`);
    }

    const targetAuthorId = target.author.toString();

    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.type === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session });

        await updateVoteCount(
          { targetId, targetType, voteType: existingVote.voteType, change: -1 },
          session,
        );
        await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        {
          session,
        },
      );
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }

    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: targetAuthorId,
      });
    });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteSchema,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { targetId, targetType, voteType, change } = validationResult.params!;

  const Model = targetType === 'question' ? Question : Answer;
  const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes';

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session },
    );

    if (!result) {
      return handleError(new Error('Target not found')) as ErrorResponse;
    }

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasVoted(params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === 'upvote',
        hasDownvoted: vote.voteType === 'downvote',
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

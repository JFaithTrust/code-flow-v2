'use server';

import mongoose from 'mongoose';

import Interaction, { IInteractionDocument } from '@/database/interaction.model';
import User from '@/database/user.model';
import {
  ActionResponse,
  CreateInteractionParams,
  ErrorResponse,
  UpdateReputationParams,
} from '@/types/model';

import action from '../handlers/action';
import handleError from '../handlers/error';
import { CreateInteractionSchema } from '../validation';

export async function createInteraction(
  params: CreateInteractionParams,
): Promise<ActionResponse<IInteractionDocument>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { action: actionType, actionId, authorId, actionTarget } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          action: actionType,
          user: userId,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session },
    );

    await updateReputation({
      interaction,
      session,
      performedId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(interaction)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performedId, authorId } = params;

  const { action, actionType } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case 'upvote':
      performerPoints += 2;
      authorPoints += 10;
      break;
    case 'downvote':
      performerPoints -= 1;
      authorPoints -= 2;
      break;
    case 'post':
      authorPoints += actionType === 'question' ? 5 : 10;
      break;
    case 'delete':
      authorPoints -= actionType === 'question' ? 5 : 10;
      break;
    default:
      break;
  }

  if (performedId === authorId) {
    await User.findByIdAndUpdate(performedId, { $inc: { reputation: authorPoints } }, { session });

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performedId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session },
  );
}

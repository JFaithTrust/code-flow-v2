import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import Account from '@/database/account.model';
import User from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { ValidationError } from '@/lib/http-errors';
import dbConnect from '@/lib/mongoose';
import { SignInWithOAuthSchema } from '@/lib/validation';
import { APIErrorResponse } from '@/types/model';

export async function POST(request: Request) {
  const { user, provider, providerAccountId } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      user,
      provider,
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const {
      user: validatedUser,
      provider: validatedProvider,
      providerAccountId: validatedProviderAccountId,
    } = validatedData.data;

    const { name, username, email, image } = validatedUser;

    const slugifiedUsername = slugify(username, { lower: true, strict: true, trim: true });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
          },
        ],
        { session },
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        existingUser = await User.findByIdAndUpdate(
          existingUser._id,
          { $set: updatedData },
          { new: true, session },
        );
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider: validatedProvider,
      providerAccountId: validatedProviderAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider: validatedProvider,
            providerAccountId: validatedProviderAccountId,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, 'api') as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

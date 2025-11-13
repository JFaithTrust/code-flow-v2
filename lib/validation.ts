import { z } from 'zod';

import { InteractionActionEnums } from '@/constants/interaction';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredEmail = z
  .string()
  .min(1, { message: 'Email is required.' })
  .regex(emailRegex, { message: 'Please provide a valid email address.' });

export const SignInSchema = z.object({
  email: requiredEmail,
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must be at most 30 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: requiredEmail,
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    .regex(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(140, { message: 'Title must be at most 140 characters long' }),
  content: z.string().min(1, { message: 'Body is required' }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: 'Tag cannot be empty' })
        .max(30, { message: 'Tag must be at most 30 characters long' }),
    )
    .min(1, { message: 'At least one tag is required' })
    .max(3, { message: 'You can add up to 3 tags' }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  email: requiredEmail,
  bio: z.string().optional(),
  image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
  location: z.string().optional(),
  portfolio: z.string().url({ message: 'Portfolio must be a valid URL' }).optional(),
  reputation: z.number().min(0, { message: 'Reputation cannot be negative' }).optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  image: z.string().url({ message: 'Please provide a valid URL.' }).optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .optional(),
  provider: z.string().min(1, { message: 'Provider is required.' }),
  providerAccountId: z.string().min(1, { message: 'Provider Account ID is required.' }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(['github', 'google']),
  providerAccountId: z.string().min(1, { message: 'Provider Account ID is required.' }),
  user: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    email: requiredEmail,
    image: z.string().url({ message: 'Image must be a valid URL' }).optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const GetQuestionsSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const PaginatedSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchSchema.extend({
  tagId: z.string().min(1, { message: 'Tag ID is required' }),
});

export const IncrementViewSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const AnswerSchema = z.object({
  content: z.string().min(50, { message: 'Answer must be at least 50 characters long' }),
});

export const CreateAnswerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const GetAnswersSchema = PaginatedSearchSchema.extend({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, { message: 'Question must be at least 5 characters long' })
    .max(140, { message: 'Question cannot exceed 140 characters' }),
  content: z.string().min(100, { message: 'Content must be at least 100 characters long' }),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: 'Target ID is required' }),
  targetType: z.enum(['question', 'answer']),
  voteType: z.enum(['upvote', 'downvote']),
});

export const UpdateVoteSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1, { message: 'Change must be -1, 0, or 1' }),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export const GetUserQuestionsSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export const GetUserAnswersSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export const GetUserTagsSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, { message: 'Question ID is required' }),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, { message: 'Answer ID is required' }),
});

export const CreateInteractionSchema = z.object({
  action: z.enum(InteractionActionEnums),
  actionId: z.string().min(1, { message: 'Action ID is required' }),
  authorId: z.string().min(1, { message: 'Author ID is required' }),
  actionTarget: z.enum(['question', 'answer']),
});

export const GlobalSearchSchema = z.object({
  query: z.string(),
  type: z.string().nullable().optional(),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters.',
    })
    .max(130, { message: "Name musn't be longer then 130 characters." }),
  username: z.string().min(3, { message: "username musn't be longer then 100 characters." }),
  portfolio: z.string().url({ message: 'Please provide valid URL' }),
  location: z.string().min(3, { message: 'Please provide proper location' }),
  bio: z.string().min(3, {
    message: 'Bio must be at least 3 characters.',
  }),
});

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters.',
    })
    .max(130, { message: "Name musn't be longer then 130 characters." }),
  username: z.string().min(3, { message: "username musn't be longer then 100 characters." }),
  portfolio: z.string().url({ message: 'Please provide valid URL' }),
  location: z.string().min(3, { message: 'Please provide proper location' }),
  bio: z.string().min(3, {
    message: 'Bio must be at least 3 characters.',
  }),
});

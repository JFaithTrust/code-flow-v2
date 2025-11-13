import { Types } from 'mongoose';

interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId;
}

interface IAnswer {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
}

interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: 'question' | 'answer';
  voteType: 'upvote' | 'downvote';
}

interface ITagQuestion {
  question: Types.ObjectId;
  tag: Types.ObjectId;
}

interface ITag {
  name: string;
  questions: number;
}

interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: 'question' | 'answer';
}

interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
type ActionResponseType<T = null> = Promise<SuccessResponse<T> | ErrorResponse>;

interface CreateInteractionParams {
  action: 'view' | 'upvote' | 'downvote' | 'bookmark' | 'post' | 'edit' | 'delete' | 'search';
  actionId: string;
  authorId: string;
  actionTarget: 'question' | 'answer';
}

interface UpdateReputationParams {
  interaction: IInteractionDocument;
  session: mongoose.ClientSession;
  performedId: string;
  authorId: string;
}

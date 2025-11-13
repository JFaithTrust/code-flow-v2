interface SignInWithOAuthParams {
  provider: 'github' | 'google';
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionsParams {
  questionId: string;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, 'filter'> {
  tagId: string;
}

interface incrementQuestionViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswerParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: 'question' | 'answer';
  voteType: 'upvote' | 'downvote';
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, 'targetId' | 'targetType'>;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams extends Omit<PaginatedSearchParams, 'filter' | 'query' | 'sort'> {
  userId: string;
}

interface GetUserAnswersParams extends Omit<PaginatedSearchParams, 'filter' | 'query' | 'sort'> {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

interface JobFilterParams {
  query: string;
  page: string;
}

interface GlobalSearchParams {
  query: string;
  type: string | null;
}

interface UpdateUserParams {
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  password?: string;
}

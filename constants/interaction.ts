export const InteractionActionEnums = [
  'view',
  'upvote',
  'downvote',
  'bookmark',
  'post',
  'edit',
  'delete',
  'search',
] as const;

export type InteractionAction = (typeof InteractionActionEnums)[number];

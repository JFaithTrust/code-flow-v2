import { model, models, Schema, Document } from 'mongoose';

import { IAnswer } from '@/types/model';

export interface IAnswerDocument extends IAnswer, Document {}

const AnswerSchema = new Schema<IAnswer>(
  {
    content: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Answer = models?.Answer || model<IAnswer>('Answer', AnswerSchema);
export default Answer;

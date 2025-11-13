import { model, models, Schema, Document } from 'mongoose';

import { IQuestion } from '@/types/model';

export interface IQuestionDocument extends IQuestion, Document {}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Question = models?.Question || model<IQuestion>('Question', QuestionSchema);

export default Question;

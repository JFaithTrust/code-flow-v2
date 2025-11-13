import { Schema, model, models, Document } from 'mongoose';

import { ITagQuestion } from '@/types/model';

export interface ITagQuestionDocument extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  },
  { timestamps: true },
);

const TagQuestion = models?.TagQuestion || model<ITagQuestion>('TagQuestion', TagQuestionSchema);

export default TagQuestion;

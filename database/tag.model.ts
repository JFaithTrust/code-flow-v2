import { Schema, model, models, Document } from 'mongoose';

import { ITag } from '@/types/model';

export interface ITagDocument extends ITag, Document {}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Tag = models?.Tag || model<ITag>('Tag', TagSchema);

export default Tag;

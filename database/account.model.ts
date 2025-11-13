import { model, models, Schema, Document } from 'mongoose';

import { IAccount } from '@/types/model';

export interface IAccountDocument extends IAccount, Document {}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);

const Account = models?.Account || model<IAccount>('Account', AccountSchema);

export default Account;

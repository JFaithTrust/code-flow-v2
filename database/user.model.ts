import { model, models, Schema, Document } from 'mongoose';

import { IUser } from '@/types/model';

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = models?.User || model<IUser>('User', UserSchema);

export default User;

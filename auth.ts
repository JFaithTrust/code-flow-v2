import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { IAccountDocument } from './database/account.model';
import { IUserDocument } from './database/user.model';
import { api } from './lib/api';
import { SignInSchema } from './lib/validation';
import { ActionResponse } from './types/model';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = (await api.accounts.getByProviderAccountId(
          account.type === 'credentials' ? token.email! : account.providerAccountId,
        )) as ActionResponse<IAccountDocument>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === 'credentials') return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === 'github'
            ? (profile?.login as string)
            : (user.name?.toLocaleLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as 'github' | 'google',
        providerAccountId: account.providerAccountId!,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProviderAccountId(
            email,
          )) as ActionResponse<IAccountDocument>;

          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString(),
          )) as ActionResponse<IUserDocument>;

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(password, existingAccount.password!);

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }

        return null;
      },
    }),
  ],
});

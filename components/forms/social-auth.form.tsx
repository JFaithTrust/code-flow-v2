'use client';

import React from 'react';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import ROUTES from '@/constants/routes';

const SocialAuthForm = () => {
  const buttonClass =
    'background-dark400_light900 body-medium text-dark200_light900 min-h-12 flex-1 rounded-2 px-4 py-3.5';

  const handleSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
      });
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error(
        `Sign in Failed: ${
          error instanceof Error ? error.message : 'An error occurred signing in.'
        }`,
      );
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn('github')}>
        <Image
          src="/icons/github.svg"
          alt="Git Hub Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain invert-colors"
        />
        <span>Log In with GitHub</span>
      </Button>
      <Button className={buttonClass} onClick={() => handleSignIn('google')}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain invert-colors"
        />
        <span>Log In with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;

'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ROUTES from '@/constants/routes';
import { signInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validation';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

const SignInForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    const result = await signInWithCredentials(data);

    if (result.success) {
      toast.success('Signed in successfully!');
      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error ${result.status}: ${result.error?.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-medium text-dark400_light700">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  required
                  type={'text'}
                  placeholder={'jahongir@example.com'}
                  className="min-h-12 rounded-1.5 border light-border-2 background-light900_dark300 pr-10 paragraph-regular text-dark300_light700 no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-medium text-dark400_light700">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder={'**********'}
                    className="min-h-12 rounded-1.5 border light-border-2 background-light900_dark300 pr-10 paragraph-regular text-dark300_light700 no-focus"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5  text-gray-400" />
                    ) : (
                      <Eye className="size-5  text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="min-h-12 w-full rounded-2 px-4 py-3 font-inter paragraph-medium text-light-900 primary-gradient">
          {form.formState.isSubmitting ? 'Processing...' : 'Sign In'}
        </Button>
        <p>
          New to CodeFlow?{' '}
          <Link href={ROUTES.SIGN_UP} className="primary-text-gradient paragraph-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;

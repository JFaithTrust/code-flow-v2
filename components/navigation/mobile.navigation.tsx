import React from 'react';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ROUTES from '@/constants/routes';

import NavLinks from './nav-links';

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          alt="Menu Icon"
          width={23}
          height={23}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent side="left" className="border-none background-light900_dark200 p-4">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link href="/" className="flex items-center gap-1">
          <Image src="/images/site-logo.svg" alt="CodeFlow Logo" width={23} height={23} />
          <p className="font-space-grotesk h2-bold text-dark100_light900">
            Code<span className="text-primary-500">Flow</span>
          </p>
        </Link>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>
          <div className="flex flex-col gap-3">
            {userId ? (
              <SheetClose asChild>
                <form
                  action={async () => {
                    'use server';

                    await signOut();
                  }}
                >
                  <Button type="submit" className="w-fit bg-transparent! px-4 py-3 base-medium">
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className="text-dark300_light900">Logout</span>
                  </Button>
                </form>
              </SheetClose>
            ) : (
              <>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button className="min-h-[41px] w-full rounded-lg btn-secondary px-4 py-3 small-medium shadow-none">
                      <span className="primary-text-gradient">Log In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_UP}>
                    <Button className="min-h-[41px] w-full rounded-lg border light-border-2 btn-tertiary px-4 py-3 small-medium text-dark400_light900 shadow-none">
                      Sign up
                    </Button>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

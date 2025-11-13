import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';

import MobileNavigation from './mobile.navigation';
import { ModeToggle } from '../shared/mode-toggle';
import UserAvatar from '../shared/user-avatar';

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="fixed z-50 flex-between w-full gap-5 background-light900_dark200 p-6 shadow-light-300 sm:px-12 dark:shadow-none">
      <Link href={'/'} className="flex items-center gap-1">
        <Image src="/images/site-logo.svg" alt="CodeFlow Logo" width={23} height={23} />
        <p className="font-space-grotesk h2-bold text-dark100_light900 max-sm:hidden">
          Code<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      {/* <GlobalSearch /> */}

      <div className="flex-between gap-5">
        <ModeToggle />

        {session?.user?.id && (
          <UserAvatar
            id={session.user.id}
            name={session.user.name!}
            imageUrl={session.user?.image}
          />
        )}

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

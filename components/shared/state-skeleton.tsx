import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui/button';

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({ image, title, message, button }: StateSkeletonProps) => {
  return (
    <div className="mt-16 flex-center w-full flex-col">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          width={270}
          height={200}
          className="block object-contain dark:hidden"
        />
      </>
      <h2 className="mt-8 h2-bold text-dark200_light900">{title}</h2>
      <p className="my-3.5 max-w-md text-center body-regular text-dark500_light700">{message}</p>
      {button && (
        <Link href={button.href}>
          <Button className="mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 paragraph-medium text-light-900 hover:bg-primary-500/90">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default StateSkeleton;

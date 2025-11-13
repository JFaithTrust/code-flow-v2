import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { cn, getDeviconClassName, getTechDescription } from '@/lib/utils';

import { Badge } from '../ui/badge';

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  onRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  onRemove,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="flex-center space-x-2 rounded-md border-none background-light800_dark300 px-4 py-2 subtle-medium text-light400_light500 uppercase">
        <i className={`${iconClass} text-sm`} />
        <span>{name}</span>

        {remove && (
          <Image
            src="/icons/close.svg"
            alt="Remove Tag"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={onRemove}
          />
        )}
      </Badge>
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="flex w-full flex-col rounded-2xl border light-border background-light900_dark200 px-8 py-10 sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className="w-fit rounded-sm background-light800_dark400! px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClass, 'text-2xl')} aria-hidden="true" />
        </div>
        <p className="mt-5 line-clamp-3 w-full small-regular text-dark500_light700">
          {iconDescription}
        </p>
        <p className="mt-3.5 small-medium text-dark400_light500">
          <span className="mr-2.5 primary-text-gradient body-semibold">{questions}+</span> Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;

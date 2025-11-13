'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';

import { Input } from '../ui/input';

interface LocalSearchProps {
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: 'left' | 'right';
}

const LocalSearch = ({
  imgSrc,
  placeholder,
  otherClasses,
  iconPosition = 'left',
}: LocalSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentSearchQuery = searchParams.get('query') || '';

      if (searchQuery && searchQuery !== currentSearchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: searchQuery,
        });

        if (newUrl !== window.location.href) {
          router.push(newUrl, { scroll: false });
        }
      } else if (!searchQuery && currentSearchQuery) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['query'],
        });

        if (newUrl !== window.location.href) {
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router]);

  return (
    <div
      className={`flex min-h-14 grow items-center gap-4 rounded-[10px] background-light800_darkgradient px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image src={imgSrc} alt="search icon" width={24} height={24} className="cursor-pointer" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-none bg-transparent! paragraph-regular placeholder text-dark400_light700 shadow-none no-focus outline-none"
      />
      {iconPosition === 'right' && (
        <Image src={imgSrc} alt="search icon" width={24} height={24} className="cursor-pointer" />
      )}
    </div>
  );
};

export default LocalSearch;

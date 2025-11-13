'use client';

import React, { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

const filters = [
  { name: 'Newest', value: 'newest' },
  { name: 'Popular', value: 'popular' },
  { name: 'Unanswered', value: 'unanswered' },
  { name: 'Recommeded', value: 'recommended' },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const [active, setActive] = useState(filterParams || '');

  const handleTypeClick = (filter: string) => {
    let newUrl = '';

    if (filter === active) {
      setActive('');

      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['filter'],
      });
    } else {
      setActive(filter);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          onClick={() => handleTypeClick(filter.value)}
          className={cn(
            'rounded-lg px-6 py-3 body-medium capitalize shadow-none',
            active === filter.value
              ? 'text-primary-500 bg-primary-100 dark:bg-dark-400'
              : 'background-light800_dark300 text-light-500',
          )}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;

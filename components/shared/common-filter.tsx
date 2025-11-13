'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { formUrlQuery } from '@/lib/url';
import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface CommonFilterProps {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
}

const CommonFilter = ({ filters, otherClasses, containerClasses }: CommonFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get('filter');

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={cn('relative', containerClasses)}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramsFilter || undefined}>
        <SelectTrigger
          className={cn(
            'border light-border background-light800_dark300 px-5 py-2.5 body-regular text-dark500_light700 no-focus',
            otherClasses,
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;

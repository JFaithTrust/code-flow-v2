'use client';

import { useEffect, useState } from 'react';

import { ReloadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { globalSearch } from '@/lib/actions/general.action';

import GlobalFilter from './global-filter';

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [result, setResult] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const global = searchParams.get('global');
  const type = searchParams.get('type');

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setLoading(true);

      try {
        const res = await globalSearch({
          query: global as string,
          type,
        });

        setResult(res.data);
      } catch (error) {
        toast.error(`${(error as Error).message}`);
        setResult([]);
      } finally {
        setLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case 'question':
        return `/questions/${id}`;
      case 'answer':
        return `/questions/${id}`;
      case 'user':
        return `/profile/${id}`;
      case 'tag':
        return `/tags/${id}`;
      default:
        return '/';
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilter />
      <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="px-5 paragraph-semibold text-dark400_light900">Top Match</p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 size-10  animate-spin text-primary-500" />
            <p className="body-regular text-dark200_light800">Browsing the whole database..</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result?.length > 0 ? (
              result?.map((item: GlobalSearchedItem, index) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="mt-1 object-contain invert-colors"
                  />

                  <div className="flex flex-col">
                    <p className="line-clamp-1 body-medium text-dark200_light800">{item.title}</p>
                    <p className="mt-1 small-medium font-bold text-light400_light500 capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-5xl">🫣</p>
                <p className="px-5 py-2.5 body-regular text-dark200_light800">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;

import React from 'react';

import { DEFAULT_ERROR, DEFAULT_EMPTY } from '@/constants/states';

import StateSkeleton from './state-skeleton';

interface DataRendererProps<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data?: T[] | null;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: '/images/light-error.png',
          dark: '/images/dark-error.png',
          alt: 'Empty Error Illustration',
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={error?.details ? JSON.stringify(error.details, null, 2) : DEFAULT_ERROR.message}
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: '/images/light-illustration.png',
          dark: '/images/dark-illustration.png',
          alt: 'Empty State Illustration',
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <div>{render(data)}</div>;
};

export default DataRenderer;

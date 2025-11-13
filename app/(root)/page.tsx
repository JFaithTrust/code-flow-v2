import { Metadata } from 'next';
import Link from 'next/link';

import QuestionCard from '@/components/cards/question.card';
import CommonFilter from '@/components/shared/common-filter';
import DataRenderer from '@/components/shared/data-renderer';
import HomeFilter from '@/components/shared/home-filter';
import LocalSearch from '@/components/shared/locale-search';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import { EMPTY_QUESTION } from '@/constants/states';
import { getAllQuestions } from '@/lib/actions/question.action';

export const metadata: Metadata = {
  title: 'Code Flow | Home',
  description:
    'Discover different programming questions and answers with recommendations from the community.',
};

export default async function Home({ searchParams }: RouteParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getAllQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button className="min-h-[46px] px-4 py-3 text-light-900! primary-gradient" asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
}

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ROUTES from '@/constants/routes';
import { getTopQuestions } from '@/lib/actions/question.action';
import { getTopTags } from '@/lib/actions/tag.question';

import TagCard from '../cards/tag.card';
import DataRenderer from '../shared/data-renderer';

const RightSidebar = async () => {
  const [
    { success: topQuestionSuccess, data: topQuestions, error: topQuestionError },
    { success: topTagSuccess, data: topTags, error: topTagError },
  ] = await Promise.all([getTopQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l light-border background-light900_dark200 p-6 pt-36 shadow-light-300 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <DataRenderer
          data={topQuestions}
          empty={{
            title: 'No questions found',
            message: 'No questions have been asked yet.',
          }}
          success={topQuestionSuccess}
          error={topQuestionError}
          render={(topQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {topQuestions.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="line-clamp-2 body-medium text-dark500_light700">{title}</p>

                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          data={topTags}
          empty={{
            title: 'No tags found',
            message: 'No tags have been created yet.',
          }}
          success={topTagSuccess}
          error={topTagError}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags.map(({ _id, name, questions }) => (
                <TagCard key={_id} _id={_id} name={name} questions={questions} showCount compact />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;

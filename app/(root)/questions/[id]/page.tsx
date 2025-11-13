import { Suspense } from 'react';

import { formatDistanceToNowStrict } from 'date-fns';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import AnswerCard from '@/components/cards/answer.card';
import TagCard from '@/components/cards/tag.card';
import Preview from '@/components/editor/preview';
import AnswerForm from '@/components/forms/answer.form';
import CommonFilter from '@/components/shared/common-filter';
import DataRenderer from '@/components/shared/data-renderer';
import Metric from '@/components/shared/metric';
import Pagination from '@/components/shared/pagination';
import SaveQuestion from '@/components/shared/save-question';
import UserAvatar from '@/components/shared/user-avatar';
import Votes from '@/components/shared/votes';
import { AnswerFilters } from '@/constants/filters';
import ROUTES from '@/constants/routes';
import { EMPTY_ANSWERS } from '@/constants/states';
import { getAllAnswers } from '@/lib/actions/answer.action';
import { hasSavedQuestion } from '@/lib/actions/collection.action';
import { getQuestionById, incrementQuestionViews } from '@/lib/actions/question.action';
import { hasVoted } from '@/lib/actions/vote.action';
import { formatNumber } from '@/lib/utils';

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestionById({ questionId: id });

  if (!success || !question) return {};

  return {
    title: question.title,
    description: question.content.slice(0, 100),
  };
}

const QuestionDetailPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;

  const { success: incrementSuccess } = await incrementQuestionViews({ questionId: id });
  const { success, data: question } = await getQuestionById({ questionId: id });

  if (!success || !question) notFound();

  const {
    success: answersSuccess,
    data: answersResult,
    error: answersError,
  } = await getAllAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  if (!answersSuccess || answersError || !answersResult) {
    console.error('Failed to load answers:', answersError);
    notFound();
  }

  if (!incrementSuccess) console.error('Failed to increment question views');

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: 'question',
  });

  const { _id, author, title, content, tags, createdAt, views, answers: answersCount } = question;
  const { totalAnswers, answers, isNext } = answersResult;

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  return (
    <>
      <div className="flex-start w-full flex-col">
        {/* delete flex-col-reverse */}
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div>
        </div>

        <h2 className="mt-3.5 w-full h2-semibold text-dark200_light900">{title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answersCount}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />

        <Preview content={content} />

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag: Tag) => (
            <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
          ))}
        </div>
      </div>

      <section className="my-5">
        <div className="flex items-center justify-between">
          <h3 className="primary-text-gradient">
            {totalAnswers} {totalAnswers === 1 ? 'Answer' : 'Answers'}
          </h3>
          <CommonFilter
            filters={AnswerFilters}
            otherClasses="sm:min-w-32"
            containerClasses="max-xs:w-full"
          />
        </div>

        <DataRenderer
          data={answers}
          error={answersError}
          success={answersSuccess}
          empty={EMPTY_ANSWERS}
          render={(answers) => answers.map((a) => <AnswerCard key={a._id} answer={a} />)}
        />

        <Pagination page={page} isNext={isNext || false} />
      </section>

      <section className="my-5">
        <AnswerForm questionId={_id} questionTitle={title} questionContent={content} />
      </section>
    </>
  );
};

export default QuestionDetailPage;

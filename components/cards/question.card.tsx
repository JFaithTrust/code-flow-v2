import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import ROUTES from '@/constants/routes';

import TagCard from './tag.card';
import EditDeleteAction from '../shared/edit-delete-action';
import Metric from '../shared/metric';

const QuestionCard = ({
  question,
  showActionBtns = false,
}: {
  question: Question;
  showActionBtns?: boolean;
}) => {
  return (
    <div className="rounded-[10px] card-wrapper p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="line-clamp-1 flex subtle-regular text-dark400_light700 sm:hidden">
            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </span>

          <Link href={ROUTES.QUESTION(question._id)}>
            <h3 className="line-clamp-1 flex-1 base-semibold text-dark200_light900 sm:h3-semibold">
              {question.title}
            </h3>
          </Link>
        </div>

        {showActionBtns && <EditDeleteAction type="Question" itemId={question._id} />}
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {question.tags.map((tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="mt-6 flex-between w-full flex-wrap gap-3">
        <Metric
          imgUrl={question.author.image}
          alt={question.author.name}
          value={question.author.name}
          title={`• asked ${formatDistanceToNow(new Date(question.createdAt), {
            addSuffix: true,
          })}`}
          href={ROUTES.PROFILE(question.author._id)}
          textStyles="max-sm:hidden body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={question.upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="message"
            value={question.answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="view"
            value={question.views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

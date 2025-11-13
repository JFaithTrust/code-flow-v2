import QuestionCard from '@/components/cards/question.card';
import DataRenderer from '@/components/shared/data-renderer';
import LocalSearch from '@/components/shared/locale-search';
import Pagination from '@/components/shared/pagination';
import { EMPTY_QUESTION } from '@/constants/states';
import { getTagQuestions } from '@/lib/actions/tag.question';

const TagsDetailPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { tag, questions, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">{tag?.name}</h1>

      <section className="mt-11">
        <LocalSearch
          placeholder="Search questions..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />
      </section>

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
};

export default TagsDetailPage;

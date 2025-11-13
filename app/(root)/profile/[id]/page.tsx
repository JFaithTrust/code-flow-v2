import Link from 'next/link';

import { auth } from '@/auth';
import AnswerCard from '@/components/cards/answer.card';
import QuestionCard from '@/components/cards/question.card';
import TagCard from '@/components/cards/tag.card';
import DataRenderer from '@/components/shared/data-renderer';
import Pagination from '@/components/shared/pagination';
import ProfileLink from '@/components/shared/profile-link';
import Stats from '@/components/shared/stats';
import UserAvatar from '@/components/shared/user-avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from '@/constants/states';
import {
  getUserAnswers,
  getUserById,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from '@/lib/actions/user.action';

const ProfilePage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  const loggedInUser = await auth();

  const { success, data, error } = await getUserById({ userId: id });

  if (!success)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="h1-bold text-dark100_light900">User not found</h1>
        <p className="max-w-md paragraph-regular text-dark200_light800">{error?.message}</p>
      </div>
    );

  const { user } = data!;

  const { data: userStats } = await getUserStats({ userId: id });

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions!;
  const { answers, isNext: hasMoreAnswers } = userAnswers!;
  const { tags } = userTopTags!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bolder"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">@{user.username}</p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolio && (
                <ProfileLink imgUrl={'/icons/link.svg'} href={user.portfolio} title={'Portfolio'} />
              )}

              {user.location && <ProfileLink imgUrl={'/icons/location.svg'} title={'Location'} />}

              <ProfileLink
                imgUrl={'/icons/calendar.svg'}
                title={`Joined ${new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}`}
              />
            </div>
            {user.bio && <p className="mt-8 paragraph-regular text-dark400_light800">{user.bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href={'/profile/edit'}>
              <Button className="min-h-12 min-w-44 btn-secondary px-4 py-3 paragraph-medium text-dark300_light900">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalAnswers={userStats?.totalAnswers || 0}
        totalQuestions={userStats?.totalQuestions || 0}
        badges={
          userStats?.badges || {
            GOLD: 0,
            SILVER: 0,
            BRONZE: 0,
          }
        }
        reputation={user.reputation || 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-2">
          <TabsList className="min-h-[42px] background-light800_dark400 p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts" className="mt-5 flex w-full flex-col gap-6">
            <DataRenderer
              data={questions}
              empty={EMPTY_QUESTION}
              success={userQuestionsSuccess}
              error={userQuestionsError}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={loggedInUser?.user?.id === question.author._id}
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <DataRenderer
              data={answers}
              empty={EMPTY_ANSWERS}
              success={userAnswersSuccess}
              error={userAnswersError}
              render={(answers) => (
                <div className="flex w-full flex-col gap-10">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                      answer={answer}
                      showActionBtns={loggedInUser?.user?.id === answer.author._id}
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreAnswers || false} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              data={tags}
              empty={EMPTY_TAGS}
              success={userTopTagsSuccess}
              error={userTopTagsError}
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;

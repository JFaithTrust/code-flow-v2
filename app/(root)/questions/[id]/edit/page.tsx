import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import QuestionForm from '@/components/forms/question.from';
import ROUTES from '@/constants/routes';
import { getQuestionById } from '@/lib/actions/question.action';

const EditQuestionPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);

  const { data: question, success } = await getQuestionById({ questionId: id });
  if (!success) return notFound();

  if (question?.author._id.toString() !== session?.user?.id) {
    return redirect(ROUTES.QUESTION(id));
  }

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestionPage;

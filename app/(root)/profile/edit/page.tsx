import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import ProfileForm from '@/components/forms/profile.form';
import ROUTES from '@/constants/routes';
import { getUserById } from '@/lib/actions/user.action';

const EditPage = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.SIGN_IN);

  const { success, data } = await getUserById({ userId: session.user.id });
  if (!success) redirect(ROUTES.SIGN_IN);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <ProfileForm user={data?.user as User} />
    </>
  );
};

export default EditPage;

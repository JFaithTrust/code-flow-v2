'use client';

import React, { use, useState } from 'react';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { toggleSaveQuestion } from '@/lib/actions/collection.action';
import { ActionResponse } from '@/types/model';

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error('You must be logged in to save a question');
    }

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || 'Failed to save the question');

      toast.success(data?.saved ? 'Question saved' : 'Question unsaved');
    } catch (error) {
      toast.error(
        `Failed to save the question: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { data } = use(hasSavedQuestionPromise);

  const { saved: hasSaved } = data || {};

  return (
    <Image
      src={hasSaved ? '/icons/star-filled.svg' : '/icons/star-red.svg'}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && 'opacity-50'}`}
      aria-label="Save Question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;

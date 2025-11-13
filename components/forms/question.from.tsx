'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { ReloadIcon } from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import ROUTES from '@/constants/routes';
import { createQuestion, updateQuestion } from '@/lib/actions/question.action';
import { AskQuestionSchema } from '@/lib/validation';

import TagCard from '../cards/tag.card';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

interface QuestionFormProps {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit }: QuestionFormProps) => {
  const editorRef = React.useRef<MDXEditorMethods>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || '',
      content: question?.content || '',
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
    if (isEdit && question) {
      const result = await updateQuestion({ questionId: question._id, ...data });

      if (result.success && result.data) {
        toast.success('Question updated successfully');

        router.push(ROUTES.QUESTION(result.data._id as string));
      } else {
        toast.error(`Error ${result.status}: ${result.error?.message || 'Something went wrong'}`);
      }
    }

    const result = await createQuestion(data);

    if (result.success && result.data) {
      toast.success('Question created successfully');

      router.push(ROUTES.QUESTION(result.data._id as string));
    } else {
      toast.error(`Error ${result.status}: ${result.error?.message || 'Something went wrong'}`);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] },
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue('tags', [...field.value, tagInput]);
        e.currentTarget.value = '';
        form.clearErrors('tags');
      } else if (tagInput.length > 15) {
        form.setError('tags', {
          type: 'manual',
          message: 'Tag should be less than 15 characters',
        });
      } else if (field.value.includes(tagInput)) {
        form.setError('tags', {
          type: 'manual',
          message: 'Tag already exists',
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue('tags', newTags);

    if (newTags.length === 0) {
      form.setError('tags', {
        type: 'manual',
        message: 'Tags are required',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="min-h-14 border light-border-2 background-light700_dark300 paragraph-regular text-dark400_light700 no-focus"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Be specific and imagine you’re asking a question to another person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor ref={editorRef} value={field.value} fieldChange={field.onChange} />
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="min-h-14 border light-border-2 background-light700_dark300 paragraph-regular text-dark400_light700 no-focus"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex-start flex-wrap gap-2.5">
                      {field?.value?.map((tag: string) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          onRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="mt-2.5 body-regular text-light-500">
                Add up to 3 tags to describe what your question is about. You need to press enter to
                add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button type="submit" className="text-light-900 primary-gradient">
            {form.formState.isSubmitting ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>{isEdit ? 'Edit Question' : 'Ask A Question'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;

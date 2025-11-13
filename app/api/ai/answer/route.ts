import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

import handleError from '@/lib/handlers/error';
import { ValidationError } from '@/lib/http-errors';
import { AIAnswerSchema } from '@/lib/validation';
import { APIErrorResponse } from '@/types/model';

export async function POST(request: Request) {
  const { question, content, userAnswer } = await request.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      temperature: 0.3,
      prompt: `Answer the following question as briefly and accurately as possible in markdown format.

      **Question:** ${question}

      **Context:** ${content}

      **User's Answer (if any):** ${userAnswer}

      If the user's answer is fully correct, return it with minimal rewording.
      If it is incomplete or incorrect, correct it concisely without extra explanation.
      Keep the response under 3 sentences or a short code block if applicable.`,
      system: `You are a helpful assistant that provides very short, accurate markdown answers.
      Avoid long explanations, intros, or conclusions.
      Use concise markdown syntax — just the key information, short lists, or short code snippets where relevant. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).`,
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse;
  }
}

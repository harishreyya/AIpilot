import { OpenAI } from 'openai';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export async function OpenAIStream(messages: Message[]) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages as any, 
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? '';
}

import type { OpenAI } from 'openai';

export const defaultCompletionParams: Omit<OpenAI.CompletionCreateParamsNonStreaming, 'prompt'> = {
  model: 'gpt-3.5-turbo-instruct',
  temperature: 0,
};

export const defaultChatParams: Omit<OpenAI.ChatCompletionCreateParamsNonStreaming, 'messages'> = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
};

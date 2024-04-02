import { promises } from "fs";
import OpenAIClass from 'openai';
import { ChatCompletionMessage } from 'openai/resources';
import dotenv from 'dotenv';

dotenv.config();

(async function main() {
  const prompt1 = await promises.readFile('fixtures/instructions/1.md', 'utf8');
  const prompt2 = await promises.readFile('fixtures/instructions/2.md', 'utf8');
  const input = await promises.readFile('fixtures/code/input.tsx', 'utf8');
  const messages = [
    { role: 'system', content: 'You are a TypeScript developer' },
    { role: 'user', content: prompt1 },
    { role: 'user', content: prompt2 },
    { role: 'user', content: input },
  ];

  const client = new OpenAIClass({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: messages as ChatCompletionMessage[],
  });

  if (response.choices[0].message.content) {
    return promises.writeFile(
      'fixtures/code/transformed.tsx',
      response.choices[0].message.content
    );
  }
})();
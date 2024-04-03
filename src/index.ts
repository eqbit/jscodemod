import { promises } from 'fs';
import OpenAIClass from 'openai';
import { ChatCompletionMessage } from 'openai/resources';
import dotenv from 'dotenv';

dotenv.config();

(async function main() {
  const prompt1 = await promises.readFile('fixtures/instructions/1.md', 'utf8');
  const prompt2 = await promises.readFile('fixtures/instructions/2.md', 'utf8');
  const prompt3 = await promises.readFile('fixtures/instructions/3.md', 'utf8');
  const prompt4 = await promises.readFile('fixtures/instructions/4.md', 'utf8');
  const input = await promises.readFile('fixtures/code/input.tsx', 'utf8');
  const messages = [
    { role: 'system', content: 'You are a TypeScript developer' },
    { role: 'user', content: prompt1 },
    { role: 'user', content: prompt2 },
    { role: 'user', content: prompt3 },
    { role: 'user', content: prompt4 },
    { role: 'user', content: 'Now please perform this refactor for the following file:' },
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
    const [scssCode, tsCode] = response.choices[0].message.content.split('// typescript');

    if (scssCode && tsCode) {
      await promises.writeFile('fixtures/code/result/index.module.scss', `${scssCode.trim()}\n`);
      await promises.writeFile('fixtures/code/result/index.tsx', `${tsCode.trim()}\n`);
    }
  }
})();

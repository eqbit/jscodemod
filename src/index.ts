import { promises } from 'fs';
import OpenAIClass from 'openai';
import { ChatCompletionMessage } from 'openai/resources';
import dotenv from 'dotenv';
import { devLog, getCleanCode, getInputFilesFromDirectory } from './utils';
import { sleep } from 'openai/core';

dotenv.config();

(async function main() {
  const [, , path] = process.argv;
  const inputs = await getInputFilesFromDirectory(`${process.cwd()}/${path}`);

  if (!inputs.length) {
    devLog('No matching files, exiting');
    return;
  }

  const client = new OpenAIClass({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });

  let messages: { role: string; content: string }[] = [
    { role: 'system', content: 'You are a TypeScript developer' },
  ];

  for (let i = 1; i < 6; i++) {
    messages.push({
      role: 'user',
      content: await promises.readFile(`instructions/${i}.md`, 'utf8'),
    });
  }

  let total = inputs.length;

  devLog(`Total files to process: ${total}`);

  for (const { path, fileName } of inputs) {
    const input = await promises.readFile(`${path}/${fileName}.tsx`, 'utf8');

    devLog(`Transforming ${path}/${fileName}`);

    messages = [
      ...messages,
      {
        role: 'user',
        content: `In the typescript code you will generate,
         please instead of "import styles from "./index.module.scss";"
         use "import styles from "./${fileName}.module.scss";"`,
      },
      { role: 'user', content: 'Now please perform this refactor for the following file:' },
      { role: 'user', content: input },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: messages as ChatCompletionMessage[],
    });

    if (response.choices[0].message.content) {
      const [scssCode, tsCode] = getCleanCode(response.choices[0].message.content);

      if (scssCode && tsCode) {
        await promises.writeFile(`${path}/${fileName}.module.scss`, scssCode);
        await promises.writeFile(`${path}/${fileName}.tsx`, tsCode);
      }
    }

    devLog('Done.', --total ? `${total} files left` : '');

    if (total) {
      await sleep(5000);
    }
  }
})();

import * as fs from 'fs';
import { InputFile } from './types';
import { lstatSync, promises } from 'fs';
import { MAX_LINES_PER_FILE } from './constants';

export function devLog(...args: string[]) {
  // eslint-disable-next-line no-console
  console.log(...args);
}

export function countFileLines(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    fs.createReadStream(filePath)
      .on('data', buffer => {
        for (let i = 0; i < buffer.length; ++i) {
          if (buffer[i] == 10) {
            lineCount++;
          }
        }
      })
      .on('end', () => {
        resolve(lineCount);
      })
      .on('error', reject);
  });
}

export async function getInputFilesFromDirectory(directoryPath: string) {
  const inputs: InputFile[] = [];
  const directoryEntries = await promises.readdir(directoryPath);

  for (const entry of directoryEntries) {
    const entryPath = `${directoryPath}/${entry}`;
    const stats = lstatSync(entryPath);
    if (stats.isDirectory()) {
      inputs.push(...(await getInputFilesFromDirectory(entryPath)));
      continue;
    }

    if (!entry.endsWith('.tsx')) {
      continue;
    }

    if ((await countFileLines(`${directoryPath}/${entry}`)) > MAX_LINES_PER_FILE) {
      devLog(`Skipping ${directoryPath}/${entry}. File is too large.`);
      continue;
    }

    const [cleanFileName] = entry.split('.tsx');

    inputs.push({
      fileName: cleanFileName,
      path: `${directoryPath}`,
    });
  }

  return inputs;
}

export function getCleanCode(apiResponse: string): [string | undefined, string | undefined] {
  let [scssCode, tsCode] = apiResponse.split('// separator //');

  if (!scssCode || !tsCode) {
    return [undefined, undefined];
  }

  scssCode = scssCode.replace('```scss', '');
  scssCode = scssCode.replace('```', '');

  tsCode = tsCode.replace('```typescript', '');
  tsCode = tsCode.replace('```', '');

  scssCode = scssCode.trim();
  tsCode = tsCode.trim();

  return [`${scssCode}\n`, `${tsCode}\n`];
}

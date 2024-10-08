import { Option, program } from 'commander';
import { readFile } from 'fs/promises';
import pLimit from 'p-limit';
import { chromium } from 'playwright';

import { urlChecker } from './check-url';
import { resultTable } from './result-table';

type Options = {
  expectedStatus: number;
  baseUrl?: string;
  url?: string;
  inputFile?: string;
  tty?: boolean;
};

const action = async (options: Options): Promise<void> => {
  const browser = await chromium.launch();
  const checkUrl = urlChecker(browser);

  if (options.url) {
    const url = options.url;
    const requestUrl = options.baseUrl ? options.baseUrl + url : url;
    const result = await checkUrl(requestUrl, options.expectedStatus);
    const table = resultTable({ urls: [url], liveProgress: false });
    table.update(url, result);
    const success = table.done();
    await browser.close();
    if (!success) {
      process.exit(1);
    }
  }

  if (options.inputFile) {
    const file = await readFile(options.inputFile, { encoding: 'utf8' });
    const urls = file
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.startsWith('#'));

    const table = resultTable({ urls, liveProgress: !!options.tty });
    table.init();

    const maxCheckConcurrency = 5;

    const rateLimit = pLimit(maxCheckConcurrency);
    await Promise.all(
      urls.map(url =>
        rateLimit(async () => {
          const requestUrl =
            options.baseUrl && url.startsWith('/')
              ? options.baseUrl + url
              : url;
          const result = await checkUrl(requestUrl, options.expectedStatus);
          table.update(url, result);
        })
      )
    );

    const success = table.done();
    await browser.close();

    if (!success) {
      process.exit(1);
    }
  }
};

const main = async () => {
  program
    .name('url-checker')
    .option<number>(
      '-s, --expected-status <number>',
      'expected HTTP status for URLs',
      (n: string) => parseInt(n, 10),
      200
    )
    .option('-b, --base-url <url>', 'Base URL for if paths are given')
    .option('-u, --url <url>', 'URL or path to check')
    .option('--no-tty', 'Not an interactive terminal')
    .addOption(
      new Option(
        '-i, --input-file <path>',
        'file of URLs or paths to check'
      ).conflicts('url')
    );

  await program.parseAsync(process.argv);
  const options = program.opts<Options>();
  await action(options);
};

main();

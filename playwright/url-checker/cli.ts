import { chromium } from 'playwright';
import chalk from 'chalk';
import { program, Option } from 'commander';
import { readFile } from 'fs/promises';
import pLimit from 'p-limit';
import { Result, urlChecker } from './check-url';

type Options = {
  expectedStatus: number;
  baseUrl?: string;
  url?: string;
  inputFile?: string;
};

const resultString = (path: string, result: Result): string => {
  if (!result.success) {
    const firstLine = chalk.bgRed(path) + chalk.red(': failure ❌');
    const failures = result.failures.map(
      failure => '  - ' + chalk.yellow(failure.description)
    );
    return firstLine + '\n' + failures.join('\n');
  } else {
    return chalk.bgGreen(path) + chalk.green(': success ✅');
  }
};

const action = async (options: Options): Promise<void> => {
  const browser = await chromium.launch();
  const checkUrl = urlChecker(browser);

  if (options.url) {
    const requestUrl = options.baseUrl
      ? options.baseUrl + options.url
      : options.url;
    const result = await checkUrl(requestUrl, options.expectedStatus);
    console.log(resultString(options.url, result));
    await browser.close();
    return process.exit(result.success ? 0 : 1);
  }

  if (options.inputFile) {
    const file = await readFile(options.inputFile, { encoding: 'utf8' });
    const urls = file
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.startsWith('#'));

    const maxCheckConcurrency = 10;
    const rateLimit = pLimit(maxCheckConcurrency);
    const results = await Promise.all(
      urls.map(url =>
        rateLimit(async () => {
          const requestUrl =
            options.baseUrl && url.startsWith('/')
              ? options.baseUrl + url
              : url;
          const result = await checkUrl(requestUrl, options.expectedStatus);
          console.log(resultString(url, result));

          return result;
        })
      )
    );

    const nFailures = results.filter(result => !result.success).length;
    if (nFailures !== 0) {
      console.log(chalk.red(`Checks for ${nFailures} failed!`));
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

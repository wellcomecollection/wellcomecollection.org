import chalk from 'chalk';
import Table from 'cli-table3';
import logUpdate from 'log-update';
import { Failures, Result } from './check-url';

type State = 'pending' | Result;

type ResultTable = {
  init: () => void;
  update: (url: string, result: Result) => void;
  done: () => boolean;
};

export const resultTable = (urls: string[]): ResultTable => {
  const data: Record<string, State> = urls.reduce(
    (acc, url) => ({ ...acc, [url]: 'pending' }),
    {}
  );

  const draw = () => {
    const table = new Table();
    const rows = Object.entries(data).map(([url, state]) => {
      if (state === 'pending') {
        return [chalk.yellow(url), '⏳'];
      } else if (state.success) {
        return [chalk.green(url), '✅'];
      } else {
        return [chalk.red(url), '❌'];
      }
    });
    table.push(...rows);
    logUpdate(table.toString());
  };

  return {
    init: () => draw(),
    update: (url: string, result: Result) => {
      data[url] = result;
      draw();
    },
    done: () => {
      logUpdate.done();
      const failures = Object.entries(data)
        .filter(([, state]) => state !== 'pending' && !state.success)
        .map(pair => pair as [string, Failures]);

      if (failures.length === 0) {
        console.log(chalk.green(`Checks for ${urls.length} succeeded`));
        return true;
      }

      console.log(chalk.red(`Checks for ${failures.length} URLs failed:`));

      const table = new Table();
      table.push(
        ...failures.map(([url, state]) => [
          chalk.red(url),
          state.failures
            .map(({ description }) => chalk.yellow('- ' + description))
            .join('\n'),
        ])
      );
      console.log(table.toString());

      return false;
    },
  };
};

import chalk from 'chalk';

export function success(message: string): void {
  console.log(chalk.greenBright(message));
}

export function warn(message: string): void {
  console.log(chalk.yellow(message));
}

export function error(message: string): void {
  console.error(`!!! ${chalk.redBright(message)}`);
}

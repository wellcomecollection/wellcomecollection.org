import chalk from 'chalk';

export function success(message: string, ...args): void {
  console.log(chalk.greenBright(message), args);
}

export function error(message: string, ...args): void {
  console.error(chalk.redBright(message), args);
}

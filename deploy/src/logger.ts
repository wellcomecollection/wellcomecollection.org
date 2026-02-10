import chalk from 'chalk';

export function logInfo(message: string): void {
  console.log(`${chalk.blue('==>')} ${message}`);
}

export function logSuccess(message: string): void {
  console.log(`${chalk.green('✓')} ${message}`);
}

export function logError(message: string): void {
  console.error(`${chalk.red('✗')} ${message}`);
}

export function logBanner(
  title: string,
  color: 'blue' | 'green' = 'blue'
): void {
  const colorFn = color === 'blue' ? chalk.blue : chalk.green;
  console.log('');
  console.log(colorFn('========================================'));
  console.log(colorFn(`  ${title}`));
  console.log(colorFn('========================================'));
  console.log('');
}

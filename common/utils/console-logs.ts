import { styleText } from 'util';

export function logInfo(message: string): void {
  console.log(styleText('blue', `==> ${message}`));
}

export function logSuccess(message: string): void {
  console.log(styleText('green', `✓ ${message}`));
}

export function logError(message: string): void {
  console.error(styleText('red', `✗ ${message}`));
}

export function logBanner(
  title: string,
  color: 'blue' | 'green' = 'blue'
): void {
  const colorName = color === 'blue' ? 'blue' : 'green';
  console.log('');
  console.log(styleText(colorName, '========================================'));
  console.log(styleText(colorName, `  ${title}`));
  console.log(styleText(colorName, '========================================'));
  console.log('');
}

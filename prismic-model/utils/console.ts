import { styleText } from 'util';

export function logSuccess(message: string): void {
  console.log(styleText('greenBright', message));
}

export function logWarn(message: string): void {
  console.log(styleText('yellow', message));
}

export function logError(message: string): void {
  console.error(`!!! ${styleText('redBright', message)}`);
}

export function logInfo(message: string): void {
  console.info(styleText('blue', message));
}

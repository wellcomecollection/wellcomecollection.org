import { styleText } from 'util';

export function success(message: string): void {
  console.log(styleText('greenBright', message));
}

export function warn(message: string): void {
  console.log(styleText('yellow', message));
}

export function error(message: string): void {
  console.error(`!!! ${styleText('redBright', message)}`);
}

export function info(message: string): void {
  console.info(styleText('blue', message));
}

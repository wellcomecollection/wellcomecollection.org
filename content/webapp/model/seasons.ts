import { CommonFields } from './common';

export type Season = CommonFields & {
  type: 'seasons';
  start: Date | undefined;
  end: Date | undefined;
};

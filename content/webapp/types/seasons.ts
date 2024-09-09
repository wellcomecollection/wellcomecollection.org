import { GenericContentFields } from './generic-content-fields';

export type Season = GenericContentFields & {
  type: 'seasons';
  uid: string;
  start?: Date;
  end?: Date;
  datePublished?: Date;
};

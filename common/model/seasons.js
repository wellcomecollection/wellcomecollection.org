// @flow
import type { GenericContentFields } from './generic-content-fields';

export type Season = {
  ...GenericContentFields,
  type: 'seasons',
  prismicDocument: any,
};

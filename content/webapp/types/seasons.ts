import { SeasonsDocumentDataBodySlice } from '@weco/common/prismicio-types';

import { GenericContentFields } from './generic-content-fields';

export type Season = GenericContentFields<SeasonsDocumentDataBodySlice> & {
  type: 'seasons';
  uid: string;
  start?: Date;
  end?: Date;
  datePublished?: Date;
};

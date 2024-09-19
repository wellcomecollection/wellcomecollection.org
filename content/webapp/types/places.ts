import * as prismic from '@prismicio/client';

import { GenericContentFields } from './generic-content-fields';

export type Place = GenericContentFields & {
  id: string;
  title: string;
  level: number;
  capacity?: number;
  information?: prismic.RichTextField;
};

export type PlaceBasic = {
  title: string;
};

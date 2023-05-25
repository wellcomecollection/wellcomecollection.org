import { GenericContentFields } from './generic-content-fields';
import * as prismic from '@prismicio/client';

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

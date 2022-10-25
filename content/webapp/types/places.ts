import { GenericContentFields } from './generic-content-fields';
import * as prismicT from '@prismicio/types';

export type Place = GenericContentFields & {
  id: string;
  title: string;
  level: number;
  capacity?: number;
  information?: prismicT.RichTextField;
};

export type PlaceBasic = {
  title: string;
};

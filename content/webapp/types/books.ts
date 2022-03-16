import { GenericContentFields } from './generic-content-fields';
import { ImageType } from '@weco/common/model/image';
import * as prismicT from '@prismicio/types';
import { Contributor } from './contributors';
import { Season } from './seasons';

type Review = {
  text: prismicT.RichTextField;
  citation: prismicT.RichTextField;
};

export type Book = GenericContentFields & {
  type: 'books';
  subtitle?: string;
  orderLink?: string;
  price?: string;
  format?: string;
  extent?: string;
  isbn?: string;
  reviews?: Review[];
  datePublished?: Date;
  cover?: ImageType;
  seasons: Season[];
  contributors: Contributor[];
};

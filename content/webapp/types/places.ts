import * as prismic from '@prismicio/client';

export type Place = {
  id: string;
  title: string;
  level: number;
  capacity?: number;
  information?: prismic.RichTextField;
};

export type PlaceBasic = {
  title: string;
};

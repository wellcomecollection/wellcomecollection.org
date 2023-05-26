import * as prismic from '@prismicio/client';
import {
  Image,
  CommonPrismicFields,
  WithContributors,
  WithExhibitionParents,
  WithSeasons,
  FetchLinks,
} from '.';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { EventFormat } from './events';
import { ArticleFormat } from './article-format';

type Label = {
  title: prismic.RichTextField;
  description: prismic.RichTextField;
};
const typeEnum = 'card';

export type WithCardFormat = {
  format:
    | prismic.ContentRelationshipField<
        'article-formats',
        'en-gb',
        InferDataInterface<ArticleFormat>
      >
    | prismic.ContentRelationshipField<
        'event-formats',
        'en-gb',
        InferDataInterface<EventFormat>
      >
    | prismic.ContentRelationshipField<
        'labels',
        'en-gb',
        InferDataInterface<Label>
      >;
};

export type CardPrismicDocument = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
    image: Image;
    link: prismic.LinkField;
    order: prismic.NumberField;
  } & WithContributors &
    WithExhibitionParents &
    WithSeasons &
    WithCardFormat &
    CommonPrismicFields,
  typeof typeEnum
>;

export const cardFetchLinks: FetchLinks<CardPrismicDocument> = [
  'card.title',
  'card.format',
  'card.description',
  'card.image',
  'card.link',
];

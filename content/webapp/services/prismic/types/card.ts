import {
  PrismicDocument,
  RichTextField,
  NumberField,
  LinkField,
  ContentRelationshipField,
} from '@prismicio/client';
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
  title: RichTextField;
  description: RichTextField;
};
const typeEnum = 'card';

export type WithCardFormat = {
  format:
    | ContentRelationshipField<
        'article-formats',
        'en-gb',
        InferDataInterface<ArticleFormat>
      >
    | ContentRelationshipField<
        'event-formats',
        'en-gb',
        InferDataInterface<EventFormat>
      >
    | ContentRelationshipField<'labels', 'en-gb', InferDataInterface<Label>>;
};

export type CardPrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
    image: Image;
    link: LinkField;
    order: NumberField;
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

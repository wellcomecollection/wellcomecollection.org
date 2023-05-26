import * as prismic from '@prismicio/client';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { Image } from '.';
import { ExhibitionPrismicDocument } from './exhibitions';

export type ExhibitionGuideComponentPrismicDocument = {
  number: prismic.NumberField;
  standaloneTitle: prismic.RichTextField;
  title: prismic.RichTextField;
  tombstone: prismic.RichTextField;
  image: Image;
  description: prismic.RichTextField;
  audioWithDescription: prismic.LinkToMediaField;
  audioWithoutDescription: prismic.LinkToMediaField;
  bslVideo: prismic.EmbedField;
  context?: prismic.RichTextField;
  caption?: prismic.RichTextField;
  transcript?: prismic.RichTextField;
};

export type ExhibitionGuidePrismicDocument = prismic.PrismicDocument<{
  title: prismic.RichTextField;
  introText: prismic.RichTextField;
  'related-exhibition': prismic.ContentRelationshipField<
    'exhibitions',
    'en-gb',
    InferDataInterface<ExhibitionPrismicDocument>
  >;
  components: prismic.GroupField<ExhibitionGuideComponentPrismicDocument>;
}>;

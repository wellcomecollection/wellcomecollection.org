import {
  PrismicDocument,
  RichTextField,
  ContentRelationshipField,
  GroupField,
  NumberField,
  LinkToMediaField,
  EmbedField,
} from '@prismicio/client';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { Image } from '.';
import { ExhibitionPrismicDocument } from './exhibitions';

export type ExhibitionGuideComponentPrismicDocument = {
  number: NumberField;
  standaloneTitle: RichTextField;
  title: RichTextField;
  tombstone: RichTextField;
  image: Image;
  description: RichTextField;
  audioWithDescription: LinkToMediaField;
  audioWithoutDescription: LinkToMediaField;
  bslVideo: EmbedField;
  context?: RichTextField;
  caption?: RichTextField;
  transcript?: RichTextField;
};

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
  title: RichTextField;
  introText: RichTextField;
  'related-exhibition': ContentRelationshipField<
    'exhibitions',
    'en-gb',
    InferDataInterface<ExhibitionPrismicDocument>
  >;
  components: GroupField<ExhibitionGuideComponentPrismicDocument>;
}>;

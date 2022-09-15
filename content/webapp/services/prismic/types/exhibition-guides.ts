import {
  PrismicDocument,
  RichTextField,
  RelationField,
  GroupField,
  NumberField,
  LinkToMediaField,
  EmbedField,
} from '@prismicio/types';
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
  context: RichTextField;
  'audio-with-description': LinkToMediaField;
  'audio-without-description': LinkToMediaField;
  'bsl-video': EmbedField;
  caption: RichTextField;
  transcript: RichTextField;
};

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
  title: RichTextField;
  introText: RichTextField;
  'related-exhibition': RelationField<
    'exhibitions',
    'en-gb',
    InferDataInterface<ExhibitionPrismicDocument>
  >;
  components: GroupField<ExhibitionGuideComponentPrismicDocument>;
}>;

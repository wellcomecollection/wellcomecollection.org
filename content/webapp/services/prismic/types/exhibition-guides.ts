import {
  PrismicDocument,
  RichTextField,
  RelationField,
  GroupField,
  NumberField,
  LinkToMediaField,
  EmbedField,
} from '@prismicio/types';
import { Image } from '.';

export type ExhibitionGuideComponentPrismicDocument = {
  number: NumberField;
  standaloneTitle: RichTextField;
  title: RichTextField;
  tombstone: RichTextField;
  image: Image;
  description: RichTextField;
  context: RichTextField;
  audioWithDescription: LinkToMediaField;
  audioWithoutDescription: LinkToMediaField;
  bslVideo: EmbedField;
  caption: RichTextField;
  transcript: RichTextField;
};

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
  title: RichTextField;
  introText: RichTextField;
  relatedExhibition: RelationField<'exhibitions'>;
  components: GroupField<ExhibitionGuideComponentPrismicDocument>;
}>;

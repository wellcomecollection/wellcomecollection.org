import {
  PrismicDocument,
  RichTextField,
  RelationField,
  GroupField,
  NumberField,
  LinkToMediaField,
  EmbedField,
} from '@prismicio/types';
import { Image, CommonPrismicFields } from '.';

export type ExhibitionLink = PrismicDocument<{
  title: RichTextField;
  // TODO: properly type the promo from linked exhibition
  promo: never;
  description: RichTextField;
}>;

export type ExhibitionGuidePrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    relatedExhibition: RelationField<'exhibitions'>;
    components: GroupField<{
      number: NumberField;
      title: RichTextField;
      tombstone: RichTextField;
      image: Image;
      description: RichTextField;
      audioWithDescription: LinkToMediaField;
      audioWithoutDescription: LinkToMediaField;
      bslVideo: EmbedField;
      caption: RichTextField;
      transcript: RichTextField;
    }>;
  } & CommonPrismicFields
>;

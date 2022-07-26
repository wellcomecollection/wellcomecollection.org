import {
  PrismicDocument,
  RichTextField,
  RelationField,
  GroupField,
  NumberField,
  LinkToMediaField,
} from '@prismicio/types';
import { Image } from '.';

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
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
    bslVideo: LinkToMediaField;
    caption: RichTextField;
    transcript: RichTextField;
  }>;
}>;

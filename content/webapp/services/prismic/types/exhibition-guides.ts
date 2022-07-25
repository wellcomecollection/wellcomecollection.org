import {
  PrismicDocument,
  RichTextField,
  RelationField,
  GroupField,
  NumberField,
  LinkToMediaField,
} from '@prismicio/types';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { Image } from '.';

export type ExhibitionFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'exhibition-formats'
>;

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
  title: RichTextField;
  relatedExhibition: RelationField<
    'exhibitions',
    'en-gb',
    InferDataInterface<ExhibitionFormat>
  >;
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

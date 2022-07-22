import {
  PrismicDocument,
  RichTextField,
  RelationField,
} from '@prismicio/types';

export type ExhibitionGuidePrismicDocument = PrismicDocument<{
  title: RichTextField;
  relatedExhibition: RelationField<'exhibition'>;
  // components:
}>;

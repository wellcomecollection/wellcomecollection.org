import { RichTextField, PrismicDocument } from '@prismicio/types';

export type ExhibitionFormat = PrismicDocument<
  {
    title: RichTextField;
  },
  'exhibition-formats'
>;

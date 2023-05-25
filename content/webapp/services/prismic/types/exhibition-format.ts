import { RichTextField, PrismicDocument } from '@prismicio/client';

export type ExhibitionFormat = PrismicDocument<
  {
    title: RichTextField;
  },
  'exhibition-formats'
>;

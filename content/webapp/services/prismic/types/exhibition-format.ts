import * as prismic from '@prismicio/client';

export type ExhibitionFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
  },
  'exhibition-formats'
>;

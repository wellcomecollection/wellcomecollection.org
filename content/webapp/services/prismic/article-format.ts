import { RichTextField, PrismicDocument } from '@prismicio/types';

export type ArticleFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'article-formats'
>;

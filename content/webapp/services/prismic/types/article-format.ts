import { RichTextField, PrismicDocument } from '@prismicio/client';

export type ArticleFormat = PrismicDocument<
  {
    title: RichTextField;
    description: RichTextField;
  },
  'article-formats'
>;

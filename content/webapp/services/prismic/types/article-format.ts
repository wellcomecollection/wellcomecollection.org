import * as prismic from '@prismicio/client';

export type ArticleFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    description: prismic.RichTextField;
  },
  'article-formats'
>;

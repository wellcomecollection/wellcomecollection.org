import * as prismic from '@prismicio/client';

export type FeaturedText = {
  type: 'text';
  weight: 'featured';
  value: prismic.RichTextField;
};

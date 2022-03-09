import * as prismicT from '@prismicio/types';

export type FeaturedText = {
  type: 'text';
  weight: 'featured';
  value: prismicT.RichTextField;
};

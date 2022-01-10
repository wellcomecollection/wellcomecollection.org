import { RichTextField, PrismicDocument } from '@prismicio/types';

export type ProjectFormat = PrismicDocument<
  {
    title: RichTextField;
  },
  'project-formats'
>;

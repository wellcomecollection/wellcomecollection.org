import * as prismic from '@prismicio/client';
import { FetchLinks } from '.';

export type ProjectFormat = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
  },
  'project-formats'
>;

export const projectFormatsFetchLinks: FetchLinks<ProjectFormat> = [
  'project-formats.title',
];

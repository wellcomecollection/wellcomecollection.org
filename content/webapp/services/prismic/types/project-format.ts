import { RichTextField, PrismicDocument } from '@prismicio/types';
import { FetchLinks } from '.';

export type ProjectFormat = PrismicDocument<
  {
    title: RichTextField;
  },
  'project-formats'
>;

export const projectFormatsFetchLinks: FetchLinks<ProjectFormat> = [
  'project-formats.title',
];

import { RichTextField, PrismicDocument } from '@prismicio/client';
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

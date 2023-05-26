import * as prismic from '@prismicio/client';
import { CommonPrismicFields, FetchLinks } from '.';

export type TeamPrismicDocument = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    subtitle: prismic.RichTextField;
    email: prismic.KeyTextField;
    phone: prismic.KeyTextField;
    url: prismic.KeyTextField;
  } & CommonPrismicFields,
  'teams'
>;

export const teamsFetchLinks: FetchLinks<TeamPrismicDocument> = [
  'teams.title',
  'teams.subtitle',
  'teams.email',
  'teams.phone',
  'teams.url',
];

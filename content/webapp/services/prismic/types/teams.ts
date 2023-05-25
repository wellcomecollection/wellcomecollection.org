import { KeyTextField, RichTextField, PrismicDocument } from '@prismicio/client';
import { CommonPrismicFields, FetchLinks } from '.';

export type TeamPrismicDocument = PrismicDocument<
  {
    title: RichTextField;
    subtitle: RichTextField;
    email: KeyTextField;
    phone: KeyTextField;
    url: KeyTextField;
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

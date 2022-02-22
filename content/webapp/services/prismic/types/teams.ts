import { KeyTextField, RichTextField, PrismicDocument } from '@prismicio/types';
import { CommonPrismicFields } from '.';

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

import {
  PrismicDocument,
  KeyTextField,
  RichTextField,
  GroupField,
  LinkField,
} from '@prismicio/types';
import { Image } from './types';

/**
 * Odd name but we've used it since the start, and never been able to change it
 * as renaming types in Prismic is impossible.
 * See {@link https://community.prismic.io/t/import-export-change-type-of-imported-document/7814}
 */
export type EditorialContributorRoles = PrismicDocument<{
  title: RichTextField;
  describedBy: KeyTextField;
}>;

export type Person = PrismicDocument<
  {
    name: KeyTextField;
    description: RichTextField;
    pronouns: KeyTextField;
    image: Image;
    sameAs: GroupField<{
      link: KeyTextField;
      title: RichTextField;
    }>;
  },
  'people'
>;

export type Organisation = PrismicDocument<
  {
    name: KeyTextField;
    description: RichTextField;
    image: Image;
    sameAs: GroupField<{
      link: LinkField;
      title: KeyTextField;
    }>;
  },
  'organisations'
>;

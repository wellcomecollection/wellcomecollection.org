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
const editorialContributorRoleType = 'editorial-contributor-role';
export type EditorialContributorRole = PrismicDocument<
  {
    title: RichTextField;
    describedBy: KeyTextField;
  },
  typeof editorialContributorRoleType
>;

const personType = 'people';
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
  typeof personType
>;

const organisationType = 'organisations';
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
  typeof organisationType
>;

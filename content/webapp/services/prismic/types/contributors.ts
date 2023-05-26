import * as prismic from '@prismicio/client';
import { Image } from '.';

/**
 * Odd name but we've used it since the start, and never been able to change it
 * as renaming types in Prismic is impossible.
 * See {@link https://community.prismic.io/t/import-export-change-type-of-imported-document/7814}
 */
const editorialContributorRoleType = 'editorial-contributor-roles';
export type EditorialContributorRole = prismic.PrismicDocument<
  {
    title: prismic.RichTextField;
    describedBy: prismic.KeyTextField;
  },
  typeof editorialContributorRoleType
>;

const personType = 'people';
export type Person = prismic.PrismicDocument<
  {
    name: prismic.KeyTextField;
    description: prismic.RichTextField;
    pronouns: prismic.KeyTextField;
    image: Image;
    sameAs: prismic.GroupField<{
      link: prismic.KeyTextField;
      title: prismic.RichTextField;
    }>;
  },
  typeof personType
>;

const organisationType = 'organisations';
export type Organisation = prismic.PrismicDocument<
  {
    name: prismic.RichTextField;
    description: prismic.RichTextField;
    image: Image;
    sameAs: prismic.GroupField<{
      link: prismic.KeyTextField;
      title: prismic.KeyTextField;
    }>;
  },
  typeof organisationType
>;

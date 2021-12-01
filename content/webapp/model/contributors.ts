import { RichTextField } from '@prismicio/types';
import { Image } from '../services/prismic/types';

export type SameAs = {
  link: string;
  title: string;
}[];

export type Person = {
  id: string;
  name: string;
  pronouns: string;
  twitterHandle: string | null;
  description: RichTextField;
  image: Image;
  sameAs: SameAs;
};

export type Organisation = {
  id: string;
  name: string;
  image: Image;
  description?: RichTextField;
  url: string | null;
  sameAs: SameAs;
};

type ContributorRole = {
  id: string;
  title: string;
  describedBy: string | null;
};

export type PersonContributor = Person & {
  type: 'people';
};

export type OrganisationContributor = Organisation & {
  type: 'organisations';
};

export type Contributor = {
  contributor: PersonContributor | OrganisationContributor;
  role: ContributorRole | null;
  description: RichTextField;
};

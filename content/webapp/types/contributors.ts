import { RichTextField } from '@prismicio/types';
import { Image } from '../services/prismic/types';

type SameAs = {
  link: string;
  title: string;
}[];

type Person = {
  type: 'people';
  id: string;
  name?: string;
  description?: RichTextField;
  image?: Image;
  sameAs: SameAs;
  pronouns?: string;
};

type Organisation = {
  type: 'organisations';
  id: string;
  name?: string;
  description?: RichTextField;
  image?: Image;
  sameAs: SameAs;
};

type ContributorRole = {
  id: string;
  title?: string;
  describedBy?: string;
};

export type Contributor = {
  contributor: Person | Organisation;
  role?: ContributorRole;
  description?: RichTextField;
};

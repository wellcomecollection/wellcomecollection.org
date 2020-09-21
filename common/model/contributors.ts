import { Person } from './people';
import { HTMLString } from '../services/prismic/types';
import { ImageType } from './image';
import { SameAs } from './same-as';

export type Organisation = {
  id: string;
  name: string;
  image: ImageType;
  description?: HTMLString;
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
  description: HTMLString | null;
};

import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';

type SameAs = {
  link: string;
  title: string;
}[];

export type Person = {
  type: 'people';
  id: string;
  name?: string;
  description?: prismic.RichTextField;
  image: ImageType;
  sameAs: SameAs;
  pronouns?: string;
};

export type Organisation = {
  type: 'organisations';
  id: string;
  name?: string;
  description?: prismic.RichTextField;
  image: ImageType;
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
  description?: prismic.RichTextField;
};

export type ContributorBasic = {
  contributor: {
    type: string;
    name?: string;
  };
};

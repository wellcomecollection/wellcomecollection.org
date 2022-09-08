import { ImageType } from '@weco/common/model/image';
import * as prismicT from '@prismicio/types';

type SameAs = {
  link: string;
  title: string;
}[];

type Person = {
  type: 'people';
  id: string;
  name?: string;
  description?: prismicT.RichTextField;
  image: ImageType;
  sameAs: SameAs;
  pronouns?: string;
};

type Organisation = {
  type: 'organisations';
  id: string;
  name?: string;
  description?: prismicT.RichTextField;
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
  description?: prismicT.RichTextField;
};

export type ContributorBasic = {
  contributor: {
    type: string;
    name?: string;
  };
};

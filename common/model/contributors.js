// @flow
import type {Person} from './people';
import type {Picture} from './picture';
import type {HTMLString} from '../services/prismic/types';

export type Organisation = {|
  name: string,
  image: ?Picture,
  url: ?string
|};

type ContributorType = | 'organisations' | 'people';

type ContributorRole = {|
  id: string,
  title: string
|}

export type PersonContributor = {|
  ...Person,
  contributorType: ContributorType
|}

export type OrganisationContributor = {|
  ...Organisation,
  contributorType: ContributorType
|}

export type Contributor = {|
  contributor: PersonContributor | OrganisationContributor,
  role: ?ContributorRole,
  description: ?HTMLString
|}

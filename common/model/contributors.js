// @flow
import type {Person} from './people';
import type {Picture} from './picture';
import type {HTMLString} from '../services/prismic/types';

export type Organisation = {|
  id: string,
  name: string,
  image: Picture,
  description?: HTMLString,
  url: ?string
|};

type ContributorType = | 'organisations' | 'people';

type ContributorRole = {|
  id: string,
  title: string
|}

export type PersonContributor = {|
  ...Person,
  type: ContributorType
|}

export type OrganisationContributor = {|
  ...Organisation,
  type: ContributorType
|}

export type Contributor = {|
  contributor: PersonContributor | OrganisationContributor,
  role: ?ContributorRole,
  description: ?HTMLString
|}

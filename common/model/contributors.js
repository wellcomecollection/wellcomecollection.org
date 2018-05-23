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

type ContributorRole = {|
  id: string,
  title: string
|}

export type PersonContributor = {|
  ...Person,
  type: 'people'
|}

export type OrganisationContributor = {|
  ...Organisation,
  type: 'organisations'
|}

export type Contributor = {|
  contributor: PersonContributor | OrganisationContributor,
  role: ?ContributorRole,
  description: ?HTMLString
|}

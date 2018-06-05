// @flow
import type {Person} from './people';
import type {HTMLString} from '../services/prismic/types';
import type {Image as ImageProps} from './image';

export type Organisation = {|
  id: string,
  name: string,
  image: ImageProps,
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

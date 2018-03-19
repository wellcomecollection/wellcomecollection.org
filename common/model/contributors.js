// @flow
import type {Person} from './people';
import type {Organization} from './organization';

type ContributorRole = {|
  id: string,
  title: string
|}

export type Contributor = {|
  contributor: Person | Organization,
  role: ?ContributorRole,
|}

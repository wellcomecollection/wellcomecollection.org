// @flow
import type Person from './people';

type ContributorRole = {|
  id: string,
  title: string
|}

export type Contributor = {|
  role: ContributorRole,
  contributor: Person | Organisation
|}
